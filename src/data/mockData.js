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
        const start = new Date(2026, 0, 1); // 1 Jan 2026
        const end = new Date(2026, 11, 31); // 31 Dec 2026
        const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

        const costVal = (30 + Math.random() * 400);
        const partsCostVal = costVal * (0.3 + Math.random() * 0.4);

        // Professional DD/MM/YYYY format padding
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const dateStr = `${day}/${month}/${year}`; // DD/MM/YYYY

        // Professional hh:mm:ss A format padding
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        const timeStr = date.toLocaleTimeString('en-US', timeOptions);

        repairs.push({
            // ID will be assigned after sorting
            customer: customer.name,
            device: model.model,
            problem: PROBLEMS[Math.floor(Math.random() * PROBLEMS.length)],
            status,
            cost: `$${costVal.toFixed(2)}`,
            partsCost: `$${partsCostVal.toFixed(2)}`,
            date: dateStr,
            hours: timeStr,
            fullDateString: date.toLocaleString('en-US') // Keep for accurate sorting
        });
    }

    // 1. Sort repairs by full date string ascending (oldest to newest)
    repairs.sort((a, b) => new Date(a.fullDateString) - new Date(b.fullDateString));

    // 2. Assign logical sequential IDs after sorting so they make chronological sense (1 to 100)
    repairs.forEach((repair, index) => {
        repair.id = index + 1;
    });

    return { deviceModels, customers, repairs };
};
