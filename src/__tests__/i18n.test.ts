import { getDictionary } from "@/lib/i18n";
import esJson from "../../messages/es.json";
import enJson from "../../messages/en.json";

describe("Módulo de Internacionalización (i18n)", () => {
  it("debe cargar los diccionarios en español e inglés", () => {
    const es = getDictionary("es");
    const en = getDictionary("en");

    expect(es).toBeDefined();
    expect(en).toBeDefined();
    expect(es.nav.spaces).toBe("Catálogo");
    expect(en.nav.spaces).toBe("Catalog");
  });

  it("debe contener las mismas secciones principales en ambos idiomas", () => {
    const esKeys = Object.keys(esJson);
    const enKeys = Object.keys(enJson);

    expect(esKeys.sort()).toEqual(enKeys.sort());
  });

  it("debe traducir correctamente las acciones de navegación y botones clave", () => {
    const es = getDictionary("es");
    const en = getDictionary("en");

    expect(es.booking.confirmBtn).toBe("Confirmar Reserva");
    expect(en.booking.confirmBtn).toBe("Confirm Booking");
  });
});
