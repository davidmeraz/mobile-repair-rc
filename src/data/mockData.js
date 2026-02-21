const BRANDS = ['Apple', 'Samsung', 'Google', 'Xiaomi', 'Motorola', 'Huawei', 'OnePlus', 'Oppo', 'Sony', 'LG'];
const TYPES = ['Smartphone', 'Tablet', 'Smartwatch'];
const CUSTOMER_NAMES = [
    'David Meraz', 'Ana Lopez', 'Carlos Gomez', 'Laura Martinez', 'Roberto Diaz',
    'Elena Rodriguez', 'Miguel Angel', 'Sofia Garcia', 'Juan Perez', 'Maria Garcia',
    'Ricardo Soto', 'Patricia Luna', 'Fernando Ruiz', 'Isabel Castro', 'Gabriel Mendoza',
    'Beatriz Herrera', 'Alejandro Sanz', 'Teresa Ortiz', 'Ignacio Leon', 'Carmen Vega',
    'Javier Blanco', 'Monica Jimenez', 'Oscar Silva', 'Luisa Morales', 'Hugo Ramos',
    'Victoria Flores', 'Adrian Mendez', 'Rosaura Delgado', 'Enrique Pena', 'Julia Santos'
];

const PROBLEMS = [
    'Pantalla OLED Rota', 'Reemplazo de Batería', 'Diagnóstico por agua',
    'Puerto de carga dañado', 'Botón de encendido falla', 'Cámara trasera borrosa',
    'No enciende', 'Software corrupto', 'Mica Cristal Templado', 'Cambio de Cámaras'
];

const STATUSES = ['Completed', 'In Progress', 'Stopped'];

export const generateMockData = () => {
    return { deviceModels: [], customers: [], repairs: [] };
};
