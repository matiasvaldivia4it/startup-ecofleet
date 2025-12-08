export const businessTypes = [
    {
        id: 'restaurant',
        label: 'Restaurante / Comida Rápida',
        capacity: 50, // orders per day estimate
        description: 'Alta rotación, entregas rápidas'
    },
    {
        id: 'retail_small',
        label: 'Retail Pequeño / Boutique',
        capacity: 10,
        description: 'Envíos programados, volumen bajo'
    },
    {
        id: 'retail_large',
        label: 'Retail Grande / Multitienda',
        capacity: 100,
        description: 'Alto volumen, logística compleja'
    },
    {
        id: 'pharmacy',
        label: 'Farmacia',
        capacity: 40,
        description: 'Prioridad alta, productos sensibles'
    },
    {
        id: 'grocery',
        label: 'Supermercado / Minimarket',
        capacity: 30,
        description: 'Volumen medio, paquetes grandes'
    },
    {
        id: 'other',
        label: 'Otro',
        capacity: 20,
        description: 'Capacidad estándar'
    }
];

export const getEstimatedCapacity = (typeId) => {
    const type = businessTypes.find(t => t.id === typeId);
    return type ? type.capacity : 0;
};
