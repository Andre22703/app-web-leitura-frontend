import React, { useState, useEffect } from 'react';

export default function StockModal({ produto, onFechar, onConfirmar }) {
  const [quantidade, setQuantidade] = useState(0);

  useEffect(() => {
    // Inicializa com o valor que está na tabela (base + alterações pendentes)
    setQuantidade(produto?.qtdstockTabela || 0); // qtdstockTabela é o valor que mostras na tabela
  }, [produto]);

  function aumentar() {
    setQuantidade(q => q + 1);
  }

  function diminuir() {
    setQuantidade(q => (q > 0 ? q - 1 : 0));
  }

  function confirmar() {
    if (quantidade < 0) {
      alert('Insira uma quantidade válida.');
      return;
    }
    // Passa a diferença entre o que está na tabela e o que foi alterado no modal
    const quantidadeAdd = quantidade - (produto?.qtdstockTabela || 0);
    onConfirmar(produto.codbarras, quantidadeAdd);
  }

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content text-start">
          <div className="modal-header">
            <h5 className="modal-title">Atualizar Stock</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onFechar}></button>
          </div>
          <div className="modal-body">
            <p><strong>{produto.descricao}</strong></p>
            <small className="text-muted">Stock atual: {produto?.qtdstock}</small>
            <div className="d-flex align-items-center gap-2">
              <button className="btn btn-outline-danger" onClick={diminuir} disabled={quantidade <= 0}>-</button>
              <input
                type="number"
                className="form-control text-center"
                value={quantidade}
                onChange={e => {
                  const val = Number(e.target.value);
                  if (!isNaN(val) && val >= 0) setQuantidade(val);
                }}
                min={0}
              />
              <button className="btn btn-outline-success" onClick={aumentar}>+</button>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onFechar}>Cancelar</button>
            <button className="btn btn-primary" onClick={confirmar}>Confirmar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
