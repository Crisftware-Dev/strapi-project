import { styles } from '@/app/styles/styles';
import { AddI, ArrowRigthI, CircleI, KeyI, PowerOffI, SearchI, SupportI, UserI } from '@/components/icons/Icons';
import { ReactElement } from 'react';

export interface MenuItem {
  id: string;
  text: string;
  icon: ReactElement;
  caret?: ReactElement;
  onClick?: (e: React.MouseEvent) => void;
  children?: MenuItem[];
}

export type ControlsBuilderProps = {
  activeControls: string;
  initials: string;
  nameAndLastname: string;
  openTab: (id: string, title: string) => void;
  setActiveSubControls: (id: string) => void;
  setActiveControls: (id: string) => void;
  setIsOpen: (open: boolean) => void;
  handleLogout: () => void;
};

export const buildControlsList = (props: ControlsBuilderProps): MenuItem[] => {
  const {
    activeControls,
    initials,
    nameAndLastname,
    openTab,
    setActiveSubControls,
    setActiveControls,
    setIsOpen,
    handleLogout,
  } = props;

  return [
    {
      id: "control",
      text: "Control",
      icon: <CircleI className={styles.icon} />,
      caret: <ArrowRigthI className={`${styles.caret} ${activeControls === "control" ? "rotate-90" : ""}`} />,
      children: [
        { id: "busqueda", text: "Busqueda de contratos", icon: <SearchI className={styles.icon} />,
          onClick: (e) => { e.stopPropagation(); openTab("busqueda", "Busqueda de contratos"); setActiveSubControls("busqueda"); setActiveControls(""); }
        },
        { id: "contratos", text: "Contratos", icon: <UserI className={styles.icon} />,
          onClick: (e) => { e.stopPropagation(); openTab("contratos", "Contratos"); setActiveSubControls("contratos"); setActiveControls(""); }
        },
        { id: "add-plans", text: "Añadir Planes", icon: <AddI className={styles.icon} />,
          onClick: (e) => { e.stopPropagation(); openTab("add-plans", "Añadir Planes"); setActiveSubControls("add-plans"); setActiveControls(""); }
        },
        { id: "soporte", text: "Soporte", icon: <SupportI className={styles.icon} />,
          onClick: (e) => { e.stopPropagation(); openTab("soporte", "Soporte"); setActiveSubControls("soporte"); setActiveControls(""); }
        },
      ],
    },
    {
      id: "configuracion",
      text: initials,
      icon: <UserI className={styles.icon} />,
      caret: <ArrowRigthI className={`${styles.caret} ${activeControls === "configuracion" ? "rotate-90" : ""}`} />,
      children: [
        { id: "usuario", text: nameAndLastname, icon: <UserI className={styles.icon} /> },
        { id: "cambiar-clave", text: "Cambiar Clave", icon: <KeyI className={styles.icon} />,
          onClick: (e) => { e.stopPropagation(); setIsOpen(true); setActiveControls(""); }
        },
        { id: "cerrar-sesion", text: "Cerrar Sesión", icon: <PowerOffI className={styles.icon} />,
          onClick: (e) => { e.stopPropagation(); handleLogout(); setActiveControls(""); }
        },
      ],
    },
  ];
};