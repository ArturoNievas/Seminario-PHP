import HeaderComponent from "./HeaderComponent";
import FooterComponent from "./FooterComponent";
import { Oval } from "react-loader-spinner";
import InputCreacionElemento from './InputCreacionElemento';

function FormChangeDatos({ titulo, handleSubmit, params, state, errorMessage, data = null }) {
    return (
        <>
            <HeaderComponent />
            {state === "Loading" ? (
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
                    <h3>{titulo}</h3>
                    <form onSubmit={(event) => handleSubmit(event)}>
                        {params.map((param, index) => (
                            <InputCreacionElemento key={index} param={param} data={data} />
                        ))}
                        <button type="submit">Enviar</button>
                    </form>
                    {state === "ERROR" && (
                        <div style={{ color: 'red' }}>
                            {Object.entries(errorMessage).map(([key, error]) => (
                                <p key={key}>{`${error}`}</p>
                            ))}
                        </div>
                    )}
                </main>
            )}
            <FooterComponent />
        </>
    );
}

export default FormChangeDatos;
