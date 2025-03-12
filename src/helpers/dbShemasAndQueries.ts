/// Función para verificar si el mensaje parece una consulta SQL
export const isSQLQuery = (text: string): boolean => {
    const sqlKeywords = [
        'buscar', 'dime', 'dame','cuál', 'cual', 'encontrar', 'mostrar', 'consultar', 'listar', 'encuentra',
        'traer', 'extraer', 'ver', 'obtener','predice','cómo','como',
        'seleccionar',  'venta con iva',
        'supervisor', 'jefe', 'canal', 'subcanal', 'segmento', 'marca', 'familia', 'linea',
        'año', 'mes', 'fecha','vendedor', 'dame', 'calcula', 'donde', 'si', 'tiene',
    ];

    return sqlKeywords.some(keyword => text.toLowerCase().includes(keyword));
};
