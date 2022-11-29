import BtnAddSale from "../../components/BtnAddSale";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { IoIosArrowDown } from "react-icons/io";
import { RiPencilFill } from "react-icons/ri";
import { FaTrash } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import BtnAddUser from "../../components/BtnAddUser";
import { useCallback, useEffect, useState } from "react";
import Pagination from "../Pagination";
import { Sale } from "../../models/sale";
import { URL_API_BACKEND } from "../../utils/request";
import axios from "axios";
import { toast } from "react-toastify";
import { AiOutlinePlus } from "react-icons/ai";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Client } from "../../models/client";
import DatePicker from "react-datepicker";

function SalesTable(search: any) {
  //listar
  function listar() {
    http: axios
      .get(`${URL_API_BACKEND}/sales?size=${SIZE}&page=${offset / SIZE}`)
      .then((response) => {
        setSales(response.data.content);
        setTotalElements(response.data.totalElements);
      });
  }

  //Listar Vendas
  const SIZE = 10;
  const [totalElements, setTotalElements] = useState({});
  const [text, setText] = useState("");
  var [offset, setOffset] = useState(0);

  const [randomNumber, setRandomNumber] = useState(0);
  const [effectLogs, setEffectLogs] = useState([]);
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    //localhost:8080/client?size=15&page=3
    http: axios
      .get(`${URL_API_BACKEND}/sales?size=${SIZE}&page=${offset / SIZE}`)
      .then((response) => {
        setSales(response.data.content);
        setTotalElements(response.data.totalElements);
        console.log(response.data.pageable.pageNumber);
        console.log(response.data);
      });
  }, [offset]);

  //Excluir
  const [deleteId, setDeleteId] = useState({});
  function deleteSale(number: any) {
    setDeleteId(number);
    http: axios
      .delete(`${URL_API_BACKEND}/sales/delete/${number}`)
      .then((response) => {
        toast.success("Venda excluida com sucesso!");
        listar();
      });
  }
  //Abre e Fecha o Modal
  function closeModal() {
    $("#editSale").modal("hide");
  }
  function openModal() {
    $("#editSale").modal("show");
  }

  //validar campos addSale
  const schema = yup
    .object({
      clients: yup.string().required("Selecione um cliente"),
      situation: yup.string().required("Selecione a situação"),
      saleValue: yup.number().required("O valor da venda é obrigatório"),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  //Listar Clientes no Select

  const [clients, setClients] = useState<Client[]>([]);
  useEffect(() => {
    axios.get(`${URL_API_BACKEND}/clients/all`).then((response) => {
      setClients(response.data);
    });
  }, []);

  //DatePicker
  const [saleDate, setSaleDate] = useState(new Date());

  const days = ["D", "S", "T", "Q", "Q", "S", "S"];
  const months = [
    "Janeiro",
    "Fevereiro",
    "Marco",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Septembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const locale = {
    localize: {
      day: (n: any) => days[n],
      month: (n: any) => months[n],
    },
    formatLong: {
      date: () => "mm/dd/yyyy",
    },
  };

  //Editar Venda

  const [clientEditSale, setClientEditSale] = useState("");
  const [situationEditSale, setSituationEditSale] = useState("");
  const [saleValueEditSale, setSaleValueEditSale] = useState("");
  const [saleDateEditSale, setSaleDateEditSale] = useState("");

  const handleChangeClientEdit = (event: any) => {
    setClientEditSale(event.target.value);
  };
  const handleChangeSituationEdit = (event: any) => {
    setSituationEditSale(event.target.value);
  };
  const handleChangeSaleValueEdit = (event: any) => {
    setSaleValueEditSale(event.target.value);
    alert(event.target.value);
  };
  const handleChangeSaleDateEdit = (event: any) => {
    setSaleDateEditSale(event.target.value);
  };

  const handleClickEditSale = (idNumber: any) => {
    openModal();
    http: axios
      .get(`${URL_API_BACKEND}/sales/findById/${idNumber}`)
      .then((response) => {
        setEditId(idNumber);
        setClientEditSale(response.data.client.id);
        setSituationEditSale(response.data.situation);
        setSaleValueEditSale(response.data.saleValue);
        setSaleDateEditSale(response.data.saleDate);
      });
  };

  const [editId, setEditId] = useState();
  function editSale(number: any) {
    alert();
    http: axios
      .put(`${URL_API_BACKEND}/sales/update/${number}`, {
        id: number,
        client: { id: 1027 },
        situation: "aguardando",
        saleValue: saleValueEditSale,
        saleDate: "2022-11-27",
        listar,
      })
      .then((response) => {
        console.log({
          id: number,
          client: { id: clientEditSale },
          situation: situationEditSale,
          saleValue: saleValueEditSale,
          saleDate: saleDateEditSale,
          listar,
        });
        toast.success("Venda editada com sucesso!");
        listar();
      });
  }

  //Mascara CNPJ
  function addMaskCNPJ(cnpj: string) {
    const cnpjWithMask =
      cnpj.substring(0, 2) +
      "." +
      cnpj.substring(2, 5) +
      "." +
      cnpj.substring(5, 8) +
      "/" +
      cnpj.substring(8, 12) +
      "-" +
      cnpj.substring(12, 14);
    return cnpjWithMask;
  }
  return (
    <>
      <div className="container">
        <div className="row mt-5">
          <div className="col-xl-8 col-lg-6">
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Digite o nome ou CNPJ do cliente que deseja procurar"
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  id="button-addon2"
                >
                  <BsSearch className="icon" />
                </button>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-6">
            <BtnAddSale />
          </div>
        </div>

        <div className="table-responsive table-responsive-xl">
          <table className="table-responsive table table-striped">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Data</th>
                <th>Status</th>
                <th>Valor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => {
                return (
                  <tr key={sale.id}>
                    <td>{sale.client.name}</td>
                    <td>{sale.date}</td>
                    <td>{sale.situation}</td>
                    <td>{sale.saleValue}</td>
                    <td>
                      <div className="btn-group">
                        <button
                          type="button"
                          className="btndropdown-toggle btn btnAction"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          Ações <IoIosArrowDown />
                        </button>
                        <div className="dropdown-menu dropdown-menu-right">
                          <button
                            className="dropdown-item"
                            type="button"
                            data-toggle="modal"
                            onClick={() => handleClickEditSale(sale.id)}
                          >
                            <RiPencilFill /> Editar
                          </button>
                          <button
                            className="dropdown-item"
                            type="button"
                            data-toggle="modal"
                            data-target="#deleteModalCenter"
                            onClick={() => setDeleteId(sale.id)}
                          >
                            <FaTrash /> Excluir
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Pagination
            size={SIZE}
            totalElements={totalElements}
            offset={offset}
            setOffset={setOffset}
          />
        </div>
      </div>

      {/* Modal de Exclusão */}
      <div
        className="modal fade"
        id="deleteModalCenter"
        role="dialog"
        aria-labelledby="deleteModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered " role="document">
          <div className="modal-content ">
            <div className="modal-header background">
              <h5 className="modal-title" id="deleteModalLongTitle">
                Excluir Venda
              </h5>
            </div>
            <div className="modal-body">
              Deseja excluir esta venda? Esta ação é irreversível e não poderá
              ser desfeita.
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btnAction"
                data-dismiss="modal"
                onClick={() => deleteSale(deleteId)}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Editar */}

      <div
        className="modal fade"
        id="editSale"
        role="dialog"
        aria-labelledby="editSaleLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header background">
              <h5 className="modal-title" id="editSaleLabel">
                Editar Venda
              </h5>
            </div>
            <div className="modal-body">
              <div>
                <form className="row">
                  <div className="col-12">
                    <h4 className="h4">Venda ######################</h4>
                    <p>Cliente: *</p>
                    <div className="input-group flex-nowrap">
                      <select
                        id="clients"
                        className="form-control"
                        {...register("clients")}
                        onChange={handleChangeClientEdit}
                        value={clientEditSale}
                      >
                        <option value=""></option>
                        {clients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.name} - {addMaskCNPJ(client.cnpj)}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.clients && (
                      <p className="validationError">
                        {errors.clients.message}
                      </p>
                    )}
                  </div>

                  <div className="col-sm-6 mt-4">
                    <p>Data da Venda: SaleDate*</p>
                    <div className="input-group flex-nowrap">
                      <DatePicker
                        value={saleDateEditSale}
                        selected={saleDate}
                        locale={locale}
                        onChange={(date: Date) => setSaleDate(date)}
                        className="form-control"
                        dateFormat="dd/MM/yyyy"
                        id="dateOfSale"
                      />
                    </div>
                  </div>

                  <div className="col-sm-6 mt-4">
                    <p>Situação: *</p>
                    <div className="input-group flex-nowrap">
                      <select
                        value={situationEditSale}
                        id="situation"
                        className="form-control"
                        {...register("situation")}
                        onChange={handleChangeSituationEdit}
                      >
                        <option value=""></option>
                        <option value="Aguardando pagamento">
                          Aguardando pagamento
                        </option>
                        <option value="Pagamento aprovado">
                          Pagamento aprovado
                        </option>
                        <option value="Aguardando envio">
                          Aguardando envio
                        </option>
                        <option value="À caminho">À caminho</option>
                        <option value="Finalizado">Finalizado</option>
                      </select>
                    </div>
                    {errors.situation && (
                      <p className="validationError">
                        {errors.situation.message}
                      </p>
                    )}
                  </div>

                  <div className="col-sm-6 mt-4">
                    <p>Valor da Venda: *</p>
                    <div className="input-group flex-nowrap">
                      <input
                        value={saleValueEditSale}
                        type="text"
                        className="form-control"
                        id="saleValue"
                        {...register("saleValue")}
                        onChange={handleChangeSaleValueEdit}
                      />
                    </div>
                    {errors.saleValue && (
                      <p className="validationError">
                        {errors.saleValue.message ==
                        'saleValue must be a `number` type, but the final value was: `NaN` (cast from the value `""`).'
                          ? "O valor da venda é obrigatório"
                          : "Digite apenas números"}
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary text-left"
                data-dismiss="modal"
                onClick={closeModal}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary btnSend"
                id="btnSend"
                onClick={() => editSale(editId)}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SalesTable;
