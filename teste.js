import React, { useState, useEffect } from "react";
import FornecedorSelect from "./components/FornecedorSelect";
import Scanner from "./components/Scanner";
import ProdutoTable from "./components/ProdutoTable";
import * as apiModule from "./services/api";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [mostrarModalToken, setMostrarModalToken] = useState(true);
  const [tokenLoja, setTokenLoja] = useState("");
  const [lojasJson, setLojasJson] = useState(null);
  const [lojaSelecionada, setLojaSelecionada] = useState(null);
  const [apiUrl, setApiUrl] = useState(null);

  const [fornecedores, setFornecedores] = useState([]);
  const [familias, setFamilias] = useState([]);
  const [subfamilias, setSubfamilias] = useState([]);

  // Buscar JSON das lojas do JSONBin
  useEffect(() => {
    const fetchLojas = async () => {
      try {
        const res = await fetch(
          "https://api.jsonbin.io/v3/b/68a2e0a5d0ea881f405c44d8",
          {
            headers: {
              "X-Master-Key":
                "$2a$10$RKrrtUJtw.UpRgJQAwsUyOElRGt4k7eDAUxluSs2g2cSmwhx1UIhW",
            },
          }
        );
        const data = await res.json();
        setLojasJson(data.record);
      } catch (err) {
        console.error("Erro ao buscar JSON das lojas:", err);
      }
    };
    fetchLojas();
  }, []);

  // Validar token da loja
  function validarToken() {
    if (!lojasJson) return;

    const loja = Object.entries(lojasJson.lojas).find(
      ([_, info]) => info.token === tokenLoja
    );

    if (loja) {
      setLojaSelecionada(loja[0]);
      setMostrarModalToken(false);
    } else {
      alert("Token inválido!");
    }
  }

  // Configurar API ao selecionar loja
  useEffect(() => {
    if (!lojaSelecionada || !lojasJson) return;

    const lojaData = lojasJson.lojas[lojaSelecionada];
    if (lojaData && lojaData.url) {
      setApiUrl(lojaData.url);
      apiModule.setApiBaseUrl(lojaData.url);
      console.log(
        `API URL definida para a loja '${lojaSelecionada}':`,
        lojaData.url
      );
    } else {
      console.warn(`URL da loja '${lojaSelecionada}' não encontrada.`);
    }
  }, [lojaSelecionada, lojasJson]);

  // Carregar dados da API
  useEffect(() => {
    if (!apiUrl) return;

    const carregarDados = async () => {
      try {
        const fornecedoresData = await apiModule.fetchFornecedores();
        setFornecedores(fornecedoresData || []);

        const familiasData = await apiModule.fetchFamilias();
        setFamilias(familiasData || []);

        const subfamiliasData = await apiModule.fetchSubfamilias();
        setSubfamilias(subfamiliasData || []);
      } catch (err) {
        console.error("Erro ao carregar dados da API:", err);
      }
    };

    carregarDados();
  }, [apiUrl]);

  return (
    <div className="container my-4">
      {/* Modal de Token */}
      {mostrarModalToken && (
        <div
          className="modal d-block fade show"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Bem-vindo</h5>
              </div>
              <div className="modal-body">
                <p>Insira o token da sua loja para continuar:</p>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Token"
                  value={tokenLoja}
                  onChange={(e) => setTokenLoja(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-success w-100"
                  onClick={validarToken}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo principal */}
      {!mostrarModalToken && (
        <>
          <div className="mb-4">
            <h3 className="text-center">Loja: {lojaSelecionada}</h3>
          </div>
          <div className="row mb-4">
            <div className="col-md-4 mb-3">
              <FornecedorSelect fornecedores={fornecedores} />
            </div>
            <div className="col-md-8 mb-3">
              <Scanner />
            </div>
          </div>
          <ProdutoTable
            fornecedores={fornecedores}
            familias={familias}
            subfamilias={subfamilias}
          />
        </>
      )}
    </div>
  );
}

export default App;
