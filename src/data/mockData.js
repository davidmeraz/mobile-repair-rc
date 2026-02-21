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

const STATUSES = ['Completed', 'In Progress', 'Pending', 'Urgent'];

export const generateMockData = () => {
    // Generate 100 Device Models
    const deviceModels = [];
    for (let i = 1; i <= 100; i++) {
        const brand = BRANDS[Math.floor(Math.random() * BRANDS.length)];
        const type = TYPES[Math.floor(Math.random() * TYPES.length)];
        let model = '';

        if (brand === 'Apple') {
            model = type === 'Tablet' ? `iPad Air ${Math.floor(i / 10) + 1}` : `iPhone ${10 + (i % 6)} Pro`;
        } else {
            model = `${brand} ${type === 'Tablet' ? 'Tab' : 'Model'} ${i * 7}`;
        }

        deviceModels.push({ id: i, brand, model, type });
    }

    // Generate 30 Customers
    const customers = CUSTOMER_NAMES.map((name, index) => {
        const id = index + 1;
        const totalRepairs = Math.floor(Math.random() * 5);
        const totalSpent = (totalRepairs * (50 + Math.random() * 200)).toFixed(2);
        return {
            id,
            name,
            phone: `555-${(1000 + id).toString().padStart(4, '0')}`,
            email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
            totalRepairs,
            totalSpent: `$${totalSpent}`
        };
    });

    // Generate 100 Repairs
    const repairs = [];
    const today = new Date();

    for (let i = 1; i <= 100; i++) {
        const customer = customers[Math.floor(Math.random() * customers.length)];
        const model = deviceModels[Math.floor(Math.random() * deviceModels.length)];
        const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
        const date = new Date(today);
        date.setDate(today.getDate() - Math.floor(Math.random() * 30));

        const costVal = (30 + Math.random() * 400);
        const partsCostVal = costVal * (0.3 + Math.random() * 0.4);

        repairs.push({
            id: i,
            customer: customer.name,
            device: model.model,
            problem: PROBLEMS[Math.floor(Math.random() * PROBLEMS.length)],
            status,
            cost: `$${costVal.toFixed(2)}`,
            partsCost: `$${partsCostVal.toFixed(2)}`,
            date: date.toLocaleDateString()
        });
    }

    // Sort repairs by ID descending
    repairs.sort((a, b) => b.id - a.id);

    return { deviceModels, customers, repairs };
};
