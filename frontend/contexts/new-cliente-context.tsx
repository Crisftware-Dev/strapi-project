"use client";

import { useClients } from "@/hooks/useClients";
import { usePlans } from "@/hooks/usePlans";
import {
  Client,
  Contact,
  DiscountLaw,
  Location,
  Plan,
} from "@/types/typesDB";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type NewClientData = Partial<Omit<Client, "documentId" | "contrato">>;

export type FieldValue = string | number | boolean | null;

interface NewClienteContextType {
  formData: NewClientData;
  setFormData: React.Dispatch<React.SetStateAction<NewClientData>>;
  handleField: (field: keyof NewClientData, value: FieldValue) => void;
  handleContact: (field: keyof Contact, value: string) => void;
  handleLocation: (field: keyof Location, value: string) => void;
  handleDiscountLaw: (field: keyof DiscountLaw, value: boolean) => void;
  resetFormData: () => void;
  existingClient: Client | null;
  isExistingClient: boolean;
  isFieldLocked: (field: string) => boolean;
  lockedFields: Set<string>;
  plans: Plan[] | undefined;
  plansResults: Plan[] | undefined;
  setPlansEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewClienteContext = createContext<NewClienteContextType | undefined>(
  undefined,
);

const DEFAULT_FORM_DATA: NewClientData = {
  estado: "PROSPECTO",
  tipoCliente: "RESIDENCIAL",
  tipoPlan: "FIBRA ÓPTICA",
  ciudad: "",
  automaticCut: true,
  withholdingAgent: false,
  automaticInvoice: true,
  relatedClient: false,
  creditButt: false,
  discardButt: false,
  hasDucts: false,
  planPrincipal: true,
  valores: 0,
  scoreCredit: 0,
  contact: { telephone: "", phoneSms: "", phoneTwo: "" },
  location: { latitude: "", longitude: "" },
  discountLaw: { disability: false, oldAge: false },
  reference: [],
  plans: [],
  files: [],
};

const LOCKED_FIELDS_FOR_EXISTING_CLIENT: ReadonlySet<string> = new Set([
  "nombres",
  "apellidos",
]);

export function NewClienteProvider({ children, enabled = false }: { children: ReactNode; enabled?: boolean }) {
  const [formData, setFormData] = useState<NewClientData>(DEFAULT_FORM_DATA);
  const [existingClient, setExistingClient] = useState<Client | null>(null);
  const [plansEnabled, setPlansEnabled] = useState(true);
  const [plansResults, setPlansResults] = useState<Plan[] | undefined>([]);

  const { data: clients } = useClients(enabled); 
  const { data: plans } = usePlans(plansEnabled && enabled);

  // SI LA IDENTIFICACIÓN YA EXISTE, DETECTAR AL CLIENTE.
  useEffect(() => {
    const id = formData.identificacion?.trim();
    if (!id) {
      setExistingClient(null);
      return;
    }

    const found =
      clients?.find((client) => client.identificacion === id) ?? null;
    setExistingClient(found);
  }, [formData.identificacion, clients]);

  // SI LA IDENTIFICACIÓN YA EXISTE COLOCAR AUTOMÁTICAMENTE NOMBRE Y APELLIDO.
  useEffect(() => {
    if (!existingClient) {
      setFormData((prev) => ({
        ...prev,
        nombres: "",
        apellidos: "",
      }));
      
      return;
    };

    setFormData((prev) => {
      if (
        prev.nombres === existingClient.nombres &&
        prev.apellidos === existingClient.apellidos
      ) {
        return prev;
      }

      return {
        ...prev,
        nombres: existingClient.nombres,
        apellidos: existingClient.apellidos,
      };
    });
  }, [existingClient]);

  const lockedFields = useMemo<Set<string>>(
    () =>
      existingClient
        ? new Set(LOCKED_FIELDS_FOR_EXISTING_CLIENT)
        : new Set<string>(),
    [existingClient],
  );

  const isFieldLocked = useCallback(
    (field: string) => lockedFields.has(field),
    [lockedFields],
  );

  // FILTRAR PLANES SEGÚN EL TIPO DE PLAN SELECCIONADO.
  useEffect(() => {
    if (plans && formData.tipoPlan) {
      const filtered = plans.filter((plan) => {
        const media = `${plan.type}`.toLowerCase();
        const search = formData.tipoPlan!.toLowerCase();
        return media.includes(search);
      });
      setPlansResults(filtered);
    } else {
      setPlansResults([]);
    }
  }, [formData.tipoPlan, plans]);

  const handleField = useCallback(
    (field: keyof NewClientData, value: FieldValue) => {
      setFormData((prev) => {
        if (lockedFields.has(field)) return prev;

        const updated: NewClientData = {
          ...prev,
          [field]: value as NewClientData[keyof NewClientData],
        };

        // Si cambia el plan contratado, actualizamos el valor y el array de plans.
        if (field === "plans") {
          const selectedPlan = plans?.find(
            (plan) => plan.documentId === value,
          );
          if (selectedPlan) {
            updated.valores = selectedPlan.valor || 0;
            updated.plans = [selectedPlan];
          } else {
            updated.plans = [];
          }
        }

        // Si cambia el tipoPlan, reseteamos el plan contratado y sus valores.
        if (field === "tipoPlan") {
          updated.plans = [];
          updated.valores = 0;
        }

        return updated;
      });
    },
    [plans, lockedFields],
  );

  const handleContact = useCallback(
    (field: keyof Contact, value: string) => {
      setFormData((prev) => ({
        ...prev,
        contact: { ...prev.contact, [field]: value } as Contact,
      }));
    },
    [],
  );

  const handleLocation = useCallback(
    (field: keyof Location, value: string) => {
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [field]: value } as Location,
      }));
    },
    [],
  );

  const handleDiscountLaw = useCallback(
    (field: keyof DiscountLaw, value: boolean) => {
      setFormData((prev) => ({
        ...prev,
        discountLaw: { ...prev.discountLaw, [field]: value } as DiscountLaw,
      }));
    },
    [],
  );

  const resetFormData = useCallback(() => {
    setFormData(DEFAULT_FORM_DATA);
  }, []);

  return (
    <NewClienteContext.Provider
      value={{
        formData,
        setFormData,
        handleField,
        handleContact,
        handleLocation,
        handleDiscountLaw,
        resetFormData,
        existingClient,
        isExistingClient: existingClient !== null,
        isFieldLocked,
        lockedFields,
        plans,
        plansResults,
        setPlansEnabled,
      }}
    >
      {children}
    </NewClienteContext.Provider>
  );
}

export function useNewClienteContext() {
  const context = useContext(NewClienteContext);
  if (context === undefined) {
    throw new Error(
      "useNewClienteContext must be used within a NewClienteProvider",
    );
  }
  return context;
}
