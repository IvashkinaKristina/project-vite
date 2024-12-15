import "./PersonalAccount.css";
import Menu from "../../GeneralModules/Menu/Menu";

export default function Lectures() {
    return (
      <div class="container-all">
        <Menu/>
         <div class="user-info">
        <img src="https://gimnaziya23saransk-r13.gosweb.gosuslugi.ru/netcat_files/8/168/1663871865_44_top_fon_com_p_serii_fon_tik_tok_foto_50.jpg" alt="Фото пользователя" class="user-photo" /> 
        <button class="button-account">Изменить фото</button>
        <div className="user-info-details">
        <div className="FIO"><h2>ФИО: Иванов Иван Иванович</h2></div>
        <div className="Group"><h2>Группа: АСОИУб-23-1</h2></div> 
        </div> 
        </div>
    </div>
    );
}

