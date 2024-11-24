import "./RegistrationForm.css";

export default function RegistrationForm(){
    return(
        <div className="RegistrForm">
            <div>
                <span className="RegIn">АВТОРИЗАЦИЯ</span>
                <div className="ContainerReg">
                    <span className="NameOfSpace">Логин</span>
                    <br />
                    <input type="text" className="SpaceToEnter"/>
                    <br />
                    <span className="NameOfSpace">Пароль</span>
                    <br />
                    <input type="text" className="SpaceToEnter"/>
                </div>
                <button className="RegButton">ВХОД</button>
            </div>
        </div>
    )
}