const esFinDeSemana = (fechaStr) => {
    const fecha = fechaStr ? new Date(fechaStr) : new Date();
    const dia = fecha.getDay();
    return dia === 0 || dia === 6;
};

const calcularBonoVenta = (precioLibro, fechaStr = null) => {
    const precio = parseFloat(precioLibro);
    return (precio * 0.3) + (esFinDeSemana(fechaStr) ? 650 : 500);
};

const calcularBonoPrestamo = (precioLibro, fechaStr = null) => {
    const precio = parseFloat(precioLibro);
    return (precio * 0.1) + (esFinDeSemana(fechaStr) ? 250 : 100);
};

module.exports = { calcularBonoVenta, calcularBonoPrestamo, esFinDeSemana };