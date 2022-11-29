import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import person from "../../assets/img/person.png";
import { ImExit } from "react-icons/im";

function CardUsuario() {
  return (
    <>
      <div className="container">
        <table>
          <tbody>
            <tr>
              <td>
                <img className="fotoPerfil" src={person} alt="Foto de perfil" />
              </td>
              <td>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <p className="nome">Kléber Moreira</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p className="cargo">Administrador</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td>
                <a href="#sair">
                  <ImExit className="iconeSair" />
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
export default CardUsuario;
