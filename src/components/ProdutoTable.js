import React from 'react';
import ProdutoRow from './ProdutoRow';

export default function ProdutoTable({ 
  produtos, 
  alteracoesPendentesStock = {}, 
  onAbrirStock, 
  onAbrirPrecoCompra, 
  onAbrirMargem, 
  onApagarProduto, 
  onPedirConfirmacaoApagar
}) {

  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered align-middle">
        <thead className="table-light">
          <tr>
            <th style={{ minWidth: '200px' }}>Descrição</th>
            <th style={{ minWidth: '150px' }}>Cod. de Barras</th>
            <th style={{ minWidth: '150px', textAlign: 'center' }}>Margem Bruta (%)</th>
            <th style={{ minWidth: '120px', textAlign: 'center' }}>Qtd. Stock</th>
            <th style={{ minWidth: '120px', textAlign: 'center' }}>Preço Compra</th>
            <th style={{ minWidth: '120px', textAlign: 'center' }}>Preço Venda</th>
            <th style={{ minWidth: '80px', textAlign: 'center' }}>Apagar</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map(produto => (
            <ProdutoRow
              key={produto.codbarras}
              produto={produto}
              alteracoesPendentesStock={alteracoesPendentesStock}
              onAbrirStock={onAbrirStock}
              onAbrirPrecoCompra={onAbrirPrecoCompra}
              onAbrirMargem={onAbrirMargem}
              onApagarProduto={onApagarProduto}
              onPedirConfirmacaoApagar={onPedirConfirmacaoApagar}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
