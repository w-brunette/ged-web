import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { ArquivoConsultar, ArquivoEditar } from '../modulos/arquivo';
import { CargoConsultar, CargoEditar, CargoIncluir } from '../modulos/cargo';
import { DepartamentoConsultar, DepartamentoEditar, DepartamentoIncluir } from '../modulos/departamento';
import { DocumentoConsultar, DocumentoEditar, DocumentoIncluir } from '../modulos/documento';
import { FuncionarioConsultar, FuncionarioEditar, FuncionarioIncluir } from '../modulos/funcionario';
import { LoginView } from '../modulos/login/login';
import { TipoConsultar, TipoEditar, TipoIncluir } from '../modulos/tipo';
import { TransferenciaConsultar, TransferenciaEditar, TransferenciaIncluir } from '../modulos/transferencia';
const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginView />,
  },
  {
    path: "ged",
    element: <App />,
    children: [
      {
        path: "arquivos",
        element: <ArquivoConsultar />
      },
      {
        path: "arquivo/:id",
        element: <ArquivoEditar />
      },
      {
        path: "departamentos",
        element: <DepartamentoConsultar />
      },
      {
        path: "departamento",
        element: <DepartamentoIncluir />
      },
      {
        path: "departamento/:id",
        element: <DepartamentoEditar />
      },
      {
        path: "cargos",
        element: <CargoConsultar />
      },
      {
        path: "cargo",
        element: <CargoIncluir />
      },
      {
        path: "cargo/:id",
        element: <CargoEditar />
      },
      {
        path: "tipos",
        element: <TipoConsultar />
      },
      {
        path: "tipo",
        element: <TipoIncluir />
      },
      {
        path: "tipo/:id",
        element: <TipoEditar />
      },
      {
        path: "funcionarios",
        element: <FuncionarioConsultar />
      },
      {
        path: "funcionario",
        element: <FuncionarioIncluir />
      },
      {
        path: "funcionario/:id",
        element: <FuncionarioEditar />
      },
      {
        path: "documentos",
        element: <DocumentoConsultar />
      },
      {
        path: "documento",
        element: <DocumentoIncluir />
      },
      {
        path: "documento/:id",
        element: <DocumentoEditar />
      },
      {
        path: "transferencias",
        element: <TransferenciaConsultar />
      },
      {
        path: "transferencia",
        element: <TransferenciaIncluir />
      },
      {
        path: "transferencia/:id",
        element: <TransferenciaEditar />
      }

    ]
  },
]);
export default router;