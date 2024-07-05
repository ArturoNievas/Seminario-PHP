import HeaderComponent from "./HeaderComponent";
import FooterComponent from "./FooterComponent";
import { Oval } from "react-loader-spinner";
import InputCreacionElemento from './InputCreacionElemento';
import '../assets/styles/FormCreacion.css';
import ButtonComponent from "./ButtonComponent";
import OptionElements from "./OptionElements";

function FormChangeDatos({ titulo, handleSubmit, params, state, errorMessage, data = null, camposDeSeleccion = null }) {
    return (
        <>
            <HeaderComponent />
            {state === "Loading" || state === "LOADING" ? (
                <div className="loading-oval-container">
                    <Oval
                        className="loading-oval"
                        visible={true}
                        color="var(--color-oval)"
                        secondaryColor="var(--color-oval)"
                        ariaLabel="oval-loading"
                    />
                </div>
            ) : (
                <main className="main-edit">
                    <div className="div-main-edit">
                        <h3>{titulo}</h3>
                        <form className="formCreacion" onSubmit={(event) => handleSubmit(event)}>
                            {params.map((param, index) => (
                                <>
                                    <InputCreacionElemento key={index} param={param} data={data} />
                                    {errorMessage && errorMessage[param] && (
                                        <div style={{ color: 'red' }}>
                                            <p>{`${errorMessage[param]}`}</p>
                                        </div>
                                    )}
                                </>
                            ))}
                            {camposDeSeleccion && camposDeSeleccion.map((param, index) => (
                                <>
                                    <OptionElements key={index} param={param} datos={data}/>
                                    {errorMessage && errorMessage[param] && (
                                        <div style={{ color: 'red' }}>
                                            <p>{`${errorMessage[param]}`}</p>
                                        </div>
                                    )}
                                </>
                            ))}
                            <ButtonComponent type="add"/>
                        </form>
                    </div>
                    {errorMessage && errorMessage['message'] && (
                        <div style={{ color: 'red' }}>
                            <p>{`${errorMessage['message']}`}</p>
                        </div>
                    )}
                </main>
            )}
            <FooterComponent />
        </>
    );
}

export default FormChangeDatos;
