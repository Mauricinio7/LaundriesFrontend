import React, { useState } from 'react';

interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
}

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([
        {
            id: 1,
            name: 'Lavado Express',
            description: 'Lavado rápido en 24 horas',
            price: 25,
        },
        {
            id: 2,
            name: 'Lavado Premium',
            description: 'Lavado delicado con tratamiento especial',
            price: 45,
        },
        {
            id: 3,
            name: 'Secado y Planchado',
            description: 'Servicio completo de secado y planchado',
            price: 35,
        },
    ]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddService = () => {
        if (formData.name && formData.description && formData.price) {
            const newService: Service = {
                id: services.length + 1,
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
            };
            setServices([...services, newService]);
            setFormData({ name: '', description: '', price: '' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Nuestros Servicios
                    </h1>
                    <p className="text-lg text-gray-600">
                        Descubre todos nuestros servicios de lavandería
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                        >
                            <h2 className="text-xl font-bold text-gray-900 mb-2">
                                {service.name}
                            </h2>
                            <p className="text-gray-600 mb-4">{service.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-bold text-blue-600">
                                    ${service.price}
                                </span>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                                    Seleccionar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Service Form */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Agregar Nuevo Servicio
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Nombre del servicio"
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="Precio"
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Descripción del servicio"
                            rows={3}
                            className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                    <button
                        onClick={handleAddService}
                        className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                        Agregar Servicio
                    </button>
                </div>
            </div>
        </div>
    );
}