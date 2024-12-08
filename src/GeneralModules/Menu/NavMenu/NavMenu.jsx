import './NavMenu.css';

export default function NavMenu({ active, onChange }){
    return (
        <nav className="side-nav">
            <button 
                className="nav-button" onClick={() => onChange()}
            >
                ЛК
            </button>
            <button 
                className={`nav-button ${active === 'lectures' ? 'active' : ''}`}
                onClick={() => onChange('lectures')}
            >
                Лекции
            </button>
            <button 
                className={`nav-button-ex ${active === 'exit' ? 'active' : ''}`}
                onClick={() => onChange('exit')}
            >
                Выход
            </button>
        </nav>
    );
};
