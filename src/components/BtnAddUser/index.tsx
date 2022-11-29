import "./styles.css";
import { BsSearch } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import CustomerTable from "../ClientTable";
import mapExample from "../../assets/img/mapExample.jpg";
import { useCallback, useEffect, useState } from "react";
import { URL_API_IBGE_UF } from "../../utils/request";
import { URL_API_BACKEND } from "../../utils/request";
import axios from "axios";
import { IbgeUF } from "../../models/ibgeUF";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputMask from "react-input-mask";
import ClientTable from "../ClientTable";
import { Client } from "../../models/client";
import { MapContainer, TileLayer } from "react-leaflet";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
const BtnAddUser = (props: any) => {
  //Inicio Dropdown de Estados
  const [ufs, setUfs] = useState<IbgeUF[]>([]);
  useEffect(() => {
    axios.get(`${URL_API_IBGE_UF}`).then((response) => {
      setUfs(response.data);
    });
  }, []);
  //Fim Dropdown de Estados

  //Inicio cadastrar Cliente
  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [uf, setUf] = useState("");
  const [phone, setPhone] = useState("");

  //Fim cadastrar Cliente

  //Inicio validar campos

  const schema = yup
    .object({
      name: yup
        .string()
        .required("Nome é obrigatório")
        .min(3, "Mínimo 3 caracteres"),
      cnpj: yup
        .string()
        .required("CNPJ é obrigatório")
        .min(14, "CNPJ inválido")
        .max(14, "CNPJ inválido"),
      email: yup
        .string()
        .required("Email é obrigatório")
        .email("Email inválido"),
      phone: yup
        .string()
        .required("Telefone é obrigatório")
        .min(11, "Telefone inválido")
        .max(11, "Telefone inválido"),
      uf: yup.string().required("UF é obrigatório"),
    })
    .required();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = useCallback(async (data: any) => {
    console.log(data);

    axios
      .post(`${URL_API_BACKEND}/clients/add`, data)
      .then((response) => {
        console.log(data);
        toast.success("Cliente cadastrado com sucesso!");
        limparCamposCadastro();
      })
      .catch((error) => {
        if (error.response.data === "CNPJ já cadastrado") {
          toast.error(error.response.data);
        } else {
          toast.error("Erro ao cadastrar cliente");
        }
      });
  }, []);

  //Fim validar campos

  //Inicio limpar campos
  function limparCamposCadastro() {
    var nome = document.getElementById("name") as HTMLInputElement;
    nome.value = "";
    var cnpj = document.getElementById("cnpj") as HTMLInputElement;
    cnpj.value = "";
    var phone = document.getElementById("phone") as HTMLInputElement;
    phone.value = "";
    var email = document.getElementById("email") as HTMLInputElement;
    email.value = "";
    var uf = document.getElementById("uf") as HTMLInputElement;
    uf.value = "";
    closeModal();
  }
  function closeModal() {
    $("#registerCustomer").modal("hide");
  }
  function openModal() {
    $("#registerCustomer").modal("show");
  }
  //Fim limpar campos
  const SIZE = 10;
  const [totalElements, setTotalElements] = useState({});
  const [text, setText] = useState("");
  var [offset, setOffset] = useState(0);
  const [clients, setClients] = useState<Client[]>([]);

  const [randomNumber, setRandomNumber] = useState(0);
  const [effectLogs, setEffectLogs] = useState([]);

  function listar() {
    http: axios
      .get(`${URL_API_BACKEND}/clients?size=${SIZE}&page=${offset / SIZE}`)
      .then((response) => {
        setClients(response.data.content);
        setTotalElements(response.data.totalElements);
      });
  }
  //Mapa
  const position = [10, -0.09];
  const icon = new L.Icon({
    iconUrl: "./marker.png",
    iconSize: new L.Point(25, 41),
    iconAnchor: [13, 41],
  });

  function funcionhandleClickOnMap(e: any) {
    const { lat, lng } = e.latlng;
    alert(lat + lng);
  }

  return (
    <>
      <div className="">
        <div className="">
          <div className="">
            <div className="input-group"></div>
          </div>
          <div className="">
            <button
              className="btn btn-outline-secondary btnCadastrar"
              type="button"
              data-toggle="modal"
              onClick={openModal}
            >
              <AiOutlinePlus className="icon me-2" />
              Cadastrar Cliente
            </button>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="registerCustomer"
        role="dialog"
        aria-labelledby="registerCustomerLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header background">
              <h5 className="modal-title" id="registerCustomerLabel">
                Cadastrar Cliente
              </h5>
            </div>
            <div className="modal-body">
              <div>
                <form className="row">
                  <div className="col-12">
                    <p>Nome: *</p>
                    <div className="input-group flex-nowrap">
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        defaultValue={name}
                        {...register("name")}
                      />
                    </div>
                    {errors.name && (
                      <p className="validationError">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="col-sm-6 mt-4">
                    <p>CNPJ: *</p>
                    <div className="input-group flex-nowrap">
                      <input
                        type="text"
                        className="form-control"
                        id="cnpj"
                        defaultValue={cnpj}
                        {...register("cnpj")}
                      />
                    </div>
                    {errors.cnpj && (
                      <p className="validationError">{errors.cnpj.message}</p>
                    )}
                  </div>

                  <div className="col-sm-6 mt-4">
                    <p>Telefone: *</p>
                    <div className="input-group flex-nowrap">
                      <input
                        type="text"
                        className="form-control"
                        id="phone"
                        defaultValue={phone}
                        {...register("phone")}
                      />
                    </div>
                    {errors.phone && (
                      <p className="validationError">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="col-sm-6 mt-4">
                    <p>UF: *</p>

                    <div className="input-group flex-nowrap">
                      <select
                        className="form-select"
                        {...register("uf")}
                        id="uf"
                      >
                        <option value=""></option>
                        {ufs.map((uf) => (
                          <option key={uf.id} value={uf.sigla}>
                            {uf.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.uf && (
                      <p style={{ color: "red" }}> {errors.uf.message}</p>
                    )}
                  </div>

                  <div className="col-sm-6 mt-4">
                    <p>Email: *</p>
                    <div className="input-group flex-nowrap">
                      <input
                        type="text"
                        className="form-control"
                        id="email"
                        defaultValue={email}
                        {...register("email")}
                      />
                    </div>
                    {errors.email && (
                      <p className="validationError">{errors.email.message}</p>
                    )}
                  </div>
                </form>
                <div>
                  <div id="map" className="map">
                    <MapContainer
                      style={{ width: "100%", height: 298 }}
                      center={{ lat: 51.505, lng: -0.09 }}
                      zoom={13}
                      scrollWheelZoom={false}
                      maxZoom={20}
                      attributionControl={true}
                      zoomControl={true}
                      doubleClickZoom={true}
                      dragging={true}
                      easeLinearity={0.35}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      <Marker position={[0, 0]} />
                    </MapContainer>
                  </div>
                </div>
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
                className="btn btn-primary btnSend"
                onClick={handleSubmit(onSubmit)}
                id="btnSend"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default BtnAddUser;
