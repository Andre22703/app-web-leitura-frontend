import React from 'react';

export default function ProdutoRow({
  produto,
  alteracoesPendentesStock = {},
  onAbrirStock,
  onAbrirPrecoCompra,
  onAbrirMargem,
  onApagarProduto, 
  onPedirConfirmacaoApagar
}) {
  const margem = Number(produto.margembruta);
  const precoCompra = Number(produto.precocompra);
const stockTotal = alteracoesPendentesStock[produto.codbarras] !== undefined
  ? produto.qtdstock + alteracoesPendentesStock[produto.codbarras]
  : produto.qtdstock;

  const precoVenda =
    !isNaN(margem) && !isNaN(precoCompra)
      ? (precoCompra * (1 + margem / 100)).toFixed(2) + '€'
      : '-';

  return (
    <tr>
      <td>{produto.descricao}</td>
      <td>{produto.codbarras}</td>
      <td
        className="text-primary fw-bold"
        style={{ cursor: 'pointer' }}
        onClick={() => onAbrirMargem(produto)}
      >
        {!isNaN(margem) ? `${margem}%` : 'N/D'}
      </td>

      <td
        className="text-primary fw-bold"
        style={{ cursor: 'pointer' }}
        onClick={() => onAbrirStock(produto)}
      >
        {stockTotal}
      </td>

      <td
        className="text-primary fw-bold"
        style={{ cursor: 'pointer' }}
        onClick={() => onAbrirPrecoCompra(produto)}
      >
        {!isNaN(precoCompra) ? precoCompra.toFixed(2) + '€' : 'N/D'}
      </td>

      <td>{precoVenda}</td>

    
      <td style={{ textAlign: 'center' }}>
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          title="Apagar produto"
          onClick={() => onPedirConfirmacaoApagar(produto)}
        >
          <i className="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  );
}
