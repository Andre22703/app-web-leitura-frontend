const API_BASE = process.env.REACT_APP_API_URL;

export async function fetchFornecedores() {
  const res = await fetch(`${API_BASE}/fornecedores`);
  if (!res.ok) throw new Error('Erro ao buscar fornecedores');
  return res.json();
}

export async function fetchFamilias() {
  const response = await fetch(`${API_BASE}/familias`);
  if (!response.ok) throw new Error('Erro ao buscar famílias');
  return await response.json();
}

export async function fetchSubfamilias() {
  const res = await fetch(`${API_BASE}/subfamilias`);
  if (!res.ok) throw new Error('Erro ao buscar subfamílias');
  return res.json();
}


export async function fetchProdutoPorCodigo(codigo, fornecedorId) {
  const res = await fetch(`${API_BASE}/produto/${codigo}?fornecedor=${fornecedorId}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error('Produto não pertence ao fornecedor selecionado.');
    throw new Error('Produto não encontrado');
  }
  return res.json();
}

export async function atualizarStock(codbarras, quantidadeAdd) {
  const res = await fetch(`${API_BASE}/produto/${codbarras}/stock`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantidade: Number(quantidadeAdd) }),
  });
  if (!res.ok) throw new Error('Falha ao atualizar stock');
  return res.json();
}

export async function atualizarPreco(codbarras, novoPreco) {
  const res = await fetch(`${API_BASE}/produto/${codbarras}/preco`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ preco: parseFloat(novoPreco) }),
  });
  if (!res.ok) throw new Error('Erro ao atualizar preço');
  return res.json();
}

export async function atualizarPrecoCompra(codbarras, novoPrecoCompra) {
  const res = await fetch(`${API_BASE}/produto/${codbarras}/precocompra`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ preco: parseFloat(novoPrecoCompra) }),
  });
  if (!res.ok) throw new Error('Erro ao atualizar preço de compra');
  return res.json();
}

export async function atualizarMargemBruta(codbarras, novaMargem) {
  const res = await fetch(`${API_BASE}/produto/${codbarras}/margembruta`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ margembruta: parseFloat(novaMargem) }),
  });
  if (!res.ok) throw new Error('Erro ao atualizar margem bruta');
  return res.json();
}

export async function criarProduto(produto) {
  const res = await fetch(`${API_BASE}/produto`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(produto),
  });
  if (!res.ok) throw new Error('Erro ao criar produto');
  return res.json();
}






