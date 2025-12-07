import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

function ApiDocs() {
    return (
        <div className="api-docs-page">
            <header className="docs-header">
                <div className="container">
                    <Link to="/" className="logo-link">
                        <h2 className="logo">
                            <span className="text-gradient">EcoFleet</span> API
                        </h2>
                    </Link>
                    <nav className="docs-nav">
                        <Link to="/" className="nav-link">Inicio</Link>
                        <Link to="/customer" className="nav-link">Portal Cliente</Link>
                    </nav>
                </div>
            </header>

            <section className="docs-section">
                <div className="container">
                    <div className="docs-hero">
                        <h1>Documentación API de EcoFleet</h1>
                        <p className="hero-subtitle">
                            Integra tu sistema ERP con nuestra plataforma de entregas ecológicas
                        </p>
                    </div>

                    <div className="docs-content">
                        <div className="doc-section card">
                            <h2>🚀 Introducción</h2>
                            <p>
                                La API de EcoFleet te permite integrar nuestro servicio de entregas ecológicas
                                directamente con tu sistema ERP o plataforma de e-commerce. Crea órdenes,
                                rastrea entregas y recibe notificaciones en tiempo real.
                            </p>
                            <div className="info-box">
                                <strong>Base URL:</strong> <code>https://api.ecofleet.cl/v1</code>
                            </div>
                        </div>

                        <div className="doc-section card">
                            <h2>🔐 Autenticación</h2>
                            <p>
                                Todas las solicitudes a la API requieren autenticación mediante API Key.
                                Obtén tus credenciales desde el <Link to="/customer">Portal de Cliente</Link>.
                            </p>

                            <h3>Ejemplo de Autenticación</h3>
                            <pre className="code-block">
                                {`curl -X GET https://api.ecofleet.cl/v1/orders \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                            </pre>
                        </div>

                        <div className="doc-section card">
                            <h2>📦 Endpoints - Órdenes</h2>

                            <div className="endpoint">
                                <div className="endpoint-header">
                                    <span className="method post">POST</span>
                                    <code>/orders</code>
                                </div>
                                <p>Crea una nueva orden de entrega</p>

                                <h4>Request Body:</h4>
                                <pre className="code-block">
                                    {`{
  "pickupAddress": {
    "street": "Av. Providencia 123",
    "commune": "Providencia",
    "region": "Región Metropolitana de Santiago"
  },
  "deliveryAddress": {
    "street": "Av. Apoquindo 456",
    "commune": "Las Condes",
    "region": "Región Metropolitana de Santiago"
  },
  "package": {
    "weight": 2.5,
    "dimensions": {
      "length": 30,
      "width": 20,
      "height": 10
    },
    "type": "standard",
    "fragile": false,
    "description": "Documentos importantes"
  },
  "scheduledFor": "2025-12-07T14:00:00Z",
  "specialInstructions": "Tocar timbre"
}`}
                                </pre>

                                <h4>Response (201 Created):</h4>
                                <pre className="code-block">
                                    {`{
  "success": true,
  "data": {
    "id": "ORD-1733507890123-abc123",
    "trackingNumber": "ECO07890123",
    "status": "pending",
    "cost": 4500,
    "distance": 8.5,
    "createdAt": "2025-12-06T15:38:10Z",
    ...
  }
}`}
                                </pre>
                            </div>

                            <div className="endpoint">
                                <div className="endpoint-header">
                                    <span className="method get">GET</span>
                                    <code>/orders</code>
                                </div>
                                <p>Obtiene la lista de todas tus órdenes</p>

                                <h4>Query Parameters:</h4>
                                <ul>
                                    <li><code>status</code> - Filtrar por estado (pending, in_transit, delivered, etc.)</li>
                                    <li><code>limit</code> - Número de resultados (default: 50)</li>
                                    <li><code>offset</code> - Paginación</li>
                                </ul>
                            </div>

                            <div className="endpoint">
                                <div className="endpoint-header">
                                    <span className="method get">GET</span>
                                    <code>/orders/:id</code>
                                </div>
                                <p>Obtiene los detalles de una orden específica</p>
                            </div>

                            <div className="endpoint">
                                <div className="endpoint-header">
                                    <span className="method put">PUT</span>
                                    <code>/orders/:id</code>
                                </div>
                                <p>Actualiza una orden existente</p>
                            </div>

                            <div className="endpoint">
                                <div className="endpoint-header">
                                    <span className="method delete">DELETE</span>
                                    <code>/orders/:id</code>
                                </div>
                                <p>Cancela una orden (solo si no ha sido recogida)</p>
                            </div>
                        </div>

                        <div className="doc-section card">
                            <h2>🔔 Webhooks</h2>
                            <p>
                                Configura webhooks para recibir notificaciones en tiempo real sobre cambios
                                en el estado de tus órdenes.
                            </p>

                            <h3>Eventos Disponibles</h3>
                            <ul>
                                <li><code>order.created</code> - Nueva orden creada</li>
                                <li><code>order.assigned</code> - Orden asignada a conductor</li>
                                <li><code>order.picked_up</code> - Paquete recogido</li>
                                <li><code>order.in_transit</code> - En camino</li>
                                <li><code>order.delivered</code> - Entregado</li>
                                <li><code>order.cancelled</code> - Orden cancelada</li>
                            </ul>

                            <h3>Payload del Webhook</h3>
                            <pre className="code-block">
                                {`{
  "event": "order.status_changed",
  "timestamp": "2025-12-06T15:38:10Z",
  "data": {
    "order": {
      "id": "ORD-1733507890123-abc123",
      "status": "in_transit",
      "trackingNumber": "ECO07890123",
      ...
    },
    "previousStatus": "picked_up",
    "newStatus": "in_transit"
  }
}`}
                            </pre>
                        </div>

                        <div className="doc-section card">
                            <h2>📊 Estados de Orden</h2>
                            <table className="status-table">
                                <thead>
                                    <tr>
                                        <th>Estado</th>
                                        <th>Descripción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><code>pending</code></td>
                                        <td>Orden creada, esperando asignación de conductor</td>
                                    </tr>
                                    <tr>
                                        <td><code>assigned</code></td>
                                        <td>Conductor asignado</td>
                                    </tr>
                                    <tr>
                                        <td><code>picked_up</code></td>
                                        <td>Paquete recogido</td>
                                    </tr>
                                    <tr>
                                        <td><code>in_transit</code></td>
                                        <td>En camino al destino</td>
                                    </tr>
                                    <tr>
                                        <td><code>delivered</code></td>
                                        <td>Entregado exitosamente</td>
                                    </tr>
                                    <tr>
                                        <td><code>cancelled</code></td>
                                        <td>Orden cancelada</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="doc-section card">
                            <h2>⚠️ Códigos de Error</h2>
                            <table className="status-table">
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Descripción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><code>400</code></td>
                                        <td>Bad Request - Datos inválidos</td>
                                    </tr>
                                    <tr>
                                        <td><code>401</code></td>
                                        <td>Unauthorized - API key inválida</td>
                                    </tr>
                                    <tr>
                                        <td><code>404</code></td>
                                        <td>Not Found - Recurso no encontrado</td>
                                    </tr>
                                    <tr>
                                        <td><code>429</code></td>
                                        <td>Too Many Requests - Límite de tasa excedido</td>
                                    </tr>
                                    <tr>
                                        <td><code>500</code></td>
                                        <td>Internal Server Error</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="doc-section card">
                            <h2>💡 Ejemplos de Integración</h2>

                            <h3>JavaScript / Node.js</h3>
                            <pre className="code-block">
                                {`const axios = require('axios');

const ecofleet = axios.create({
  baseURL: 'https://api.ecofleet.cl/v1',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

// Crear orden
async function createOrder(orderData) {
  try {
    const response = await ecofleet.post('/orders', orderData);
    console.log('Orden creada:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}

// Obtener órdenes
async function getOrders() {
  const response = await ecofleet.get('/orders');
  return response.data;
}`}
                            </pre>

                            <h3>Python</h3>
                            <pre className="code-block">
                                {`import requests

API_KEY = 'YOUR_API_KEY'
BASE_URL = 'https://api.ecofleet.cl/v1'

headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json'
}

# Crear orden
def create_order(order_data):
    response = requests.post(
        f'{BASE_URL}/orders',
        headers=headers,
        json=order_data
    )
    return response.json()

# Obtener órdenes
def get_orders():
    response = requests.get(
        f'{BASE_URL}/orders',
        headers=headers
    )
    return response.json()`}
                            </pre>
                        </div>

                        <div className="doc-section card">
                            <h2>🆘 Soporte</h2>
                            <p>
                                ¿Necesitas ayuda con la integración? Contáctanos:
                            </p>
                            <ul>
                                <li>📧 Email: <a href="mailto:api@ecofleet.cl">api@ecofleet.cl</a></li>
                                <li>💬 Slack: <a href="#">Canal de Desarrolladores</a></li>
                                <li>📚 GitHub: <a href="#">Ejemplos y SDKs</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

            <style jsx>{`
        .api-docs-page {
          min-height: 100vh;
          background: var(--color-gray-50);
        }

        .docs-header {
          background: white;
          padding: var(--space-6) 0;
          box-shadow: var(--shadow-sm);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .docs-header .container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo-link {
          text-decoration: none;
        }

        .logo {
          font-size: var(--font-size-2xl);
          font-weight: 800;
          margin: 0;
        }

        .docs-nav {
          display: flex;
          gap: var(--space-6);
        }

        .nav-link {
          color: var(--color-gray-600);
          font-weight: 600;
          transition: color var(--transition-fast);
        }

        .nav-link:hover {
          color: var(--color-primary-600);
        }

        .docs-section {
          padding: var(--space-16) 0;
        }

        .docs-hero {
          text-align: center;
          margin-bottom: var(--space-16);
        }

        .docs-hero h1 {
          font-size: var(--font-size-5xl);
          margin-bottom: var(--space-4);
        }

        .hero-subtitle {
          font-size: var(--font-size-xl);
          color: var(--color-gray-600);
        }

        .docs-content {
          max-width: 900px;
          margin: 0 auto;
        }

        .doc-section {
          margin-bottom: var(--space-8);
          padding: var(--space-8);
        }

        .doc-section h2 {
          font-size: var(--font-size-3xl);
          margin-bottom: var(--space-6);
          color: var(--color-gray-900);
        }

        .doc-section h3 {
          font-size: var(--font-size-xl);
          margin: var(--space-6) 0 var(--space-4);
          color: var(--color-gray-800);
        }

        .doc-section h4 {
          font-size: var(--font-size-lg);
          margin: var(--space-4) 0 var(--space-3);
          color: var(--color-gray-700);
        }

        .doc-section p {
          color: var(--color-gray-600);
          line-height: 1.7;
          margin-bottom: var(--space-4);
        }

        .doc-section ul {
          margin: var(--space-4) 0;
          padding-left: var(--space-6);
        }

        .doc-section li {
          margin-bottom: var(--space-2);
          color: var(--color-gray-600);
        }

        .info-box {
          background: var(--color-primary-50);
          border-left: 4px solid var(--color-primary-500);
          padding: var(--space-4);
          border-radius: var(--radius-md);
          margin: var(--space-4) 0;
        }

        .code-block {
          background: var(--color-gray-900);
          color: #a9dc76;
          padding: var(--space-5);
          border-radius: var(--radius-md);
          overflow-x: auto;
          font-size: var(--font-size-sm);
          line-height: 1.6;
          margin: var(--space-4) 0;
          font-family: 'Courier New', monospace;
        }

        code {
          background: var(--color-gray-100);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
          color: var(--color-primary-700);
        }

        .endpoint {
          margin: var(--space-6) 0;
          padding: var(--space-5);
          background: var(--color-gray-50);
          border-radius: var(--radius-lg);
          border-left: 4px solid var(--color-primary-500);
        }

        .endpoint-header {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-3);
        }

        .method {
          padding: var(--space-1) var(--space-3);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          font-weight: 700;
          text-transform: uppercase;
        }

        .method.get {
          background: #dbeafe;
          color: #1e40af;
        }

        .method.post {
          background: #d1fae5;
          color: #065f46;
        }

        .method.put {
          background: #fef3c7;
          color: #92400e;
        }

        .method.delete {
          background: #fee2e2;
          color: #991b1b;
        }

        .status-table {
          width: 100%;
          border-collapse: collapse;
          margin: var(--space-4) 0;
        }

        .status-table th,
        .status-table td {
          padding: var(--space-3);
          text-align: left;
          border-bottom: 1px solid var(--color-gray-200);
        }

        .status-table th {
          background: var(--color-gray-50);
          font-weight: 700;
          color: var(--color-gray-900);
        }

        .status-table td {
          color: var(--color-gray-600);
        }

        @media (max-width: 768px) {
          .docs-section {
            padding: var(--space-8) 0;
          }

          .docs-hero h1 {
            font-size: var(--font-size-3xl);
          }

          .doc-section {
            padding: var(--space-6);
          }

          .docs-nav {
            display: none;
          }
        }
      `}</style>
        </div>
    );
}

export default ApiDocs;
