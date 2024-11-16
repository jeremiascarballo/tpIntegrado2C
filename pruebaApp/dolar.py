class Dolar():
    def __init__(self, dolar):
        self.cargar_dolar(dolar)

    def cargar_dolar(self, dolar):
        self.dolar = dolar

    def mostrar_dolar(self):
        return self.dolar

class Casa(Dolar):
    def __init__(self, nombre_dolar, nombre, compra, venta, fecha):
        super().__init__(nombre_dolar)
        self.cargar_nombre(nombre)
        self.cargar_compra(compra)
        self.cargar_venta(venta)
        self.cargar_fecha(fecha)

    def cargar_nombre(self, nombre):
        self.nombre = nombre

    def mostrar_nombre(self):
        return self.nombre

    def cargar_compra(self, compra):
        self.compra = compra

    def mostrar_compra(self):
        return self.compra

    def cargar_venta(self, venta):
        self.venta = venta

    def mostrar_venta(self):
        return self.venta

    def cargar_fecha(self, fecha):
        self.fecha = fecha

    def mostrar_fecha(self):
        return self.fecha

    def __str__(self):
        return f"{self.mostrar_dolar()}, {self.mostrar_nombre()}, {self.mostrar_compra()}, {self.mostrar_venta()}, {self.mostrar_fecha()}"
