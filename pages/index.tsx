import React, { useState, useEffect } from 'react';

const PLAN_CONFIG = {
  BASIC: { limit: 10 },
  PREMIUM: { limit: 50 }
};

export default function Home() {
  const [userPlan, setUserPlan] = useState('BASIC');
  const [material, setMaterial] = useState('');
  const [local, setLocal] = useState('');
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(false);

  const [empresas, setEmpresas] = useState([]);
  const [empresaAtivaId, setEmpresaAtivaId] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('empresas_saas');
    if (data) setEmpresas(JSON.parse(data));

    const plan = localStorage.getItem('user_plan');
    if (plan) setUserPlan(plan);
  }, []);

  useEffect(() => {
    localStorage.setItem('empresas_saas', JSON.stringify(empresas));
  }, [empresas]);

  const empresaAtiva = empresas.find(e => e.id === empresaAtivaId);

  const addEmpresa = () => {
    const nome = prompt('Nome da empresa');
    const cnpj = prompt('CNPJ');
    if (!nome || !cnpj) return;

    const nova = { id: Date.now(), nome, cnpj };
    setEmpresas([...empresas, nova]);
    setEmpresaAtivaId(nova.id);
  };

  const buscar = async () => {
    if (!empresaAtiva) {
      alert('Selecione uma empresa');
      return;
    }

    setLoading(true);

    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ material, local })
    });

    const data = await res.json();

    const limite = PLAN_CONFIG[userPlan].limit;
    setFornecedores(data.local_results?.slice(0, limite) || []);

    setLoading(false);
  };

  const gerarMsg = () => {
    if (!empresaAtiva) return '';

    return encodeURIComponent(
      `Olá, sou da empresa ${empresaAtiva.nome} (CNPJ: ${empresaAtiva.cnpj}) e gostaria de uma cotação para ${material}.`
    );
  };

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', color: '#fff', padding: 20 }}>
      <h1>Mestre das Compras IA</h1>

      <button onClick={addEmpresa}>+ Empresa</button>

      <select onChange={e => setEmpresaAtivaId(Number(e.target.value))}>
        <option>Selecionar empresa</option>
        {empresas.map(e => (
          <option key={e.id} value={e.id}>{e.nome}</option>
        ))}
      </select>

      <input placeholder="Material" onChange={e => setMaterial(e.target.value)} />
      <input placeholder="Local" onChange={e => setLocal(e.target.value)} />

      <button onClick={buscar}>
        {loading ? 'Buscando...' : 'Buscar'}
      </button>

      <br /><br />

      <button
        onClick={() => window.open('https://wa.me/SEUNUMERO?text=Quero assinar o plano BASIC', '_blank')}
      >
        Assinar BASIC
      </button>

      <button
        onClick={() => window.open('https://wa.me/SEUNUMERO?text=Quero assinar o plano PREMIUM', '_blank')}
      >
        Assinar PREMIUM
      </button>

      <div>
        {fornecedores.map((f, i) => {
          const telefone = f.phone ? f.phone.replace(/\D/g, '') : '';
          return (
            <div key={i}>
              <h3>{f.title}</h3>
              <p>{f.address}</p>

              {telefone && (
                <a href={`https://wa.me/${telefone}?text=${gerarMsg()}`} target="_blank">
                  WhatsApp
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
