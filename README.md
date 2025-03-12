
# api_IA_business
API that connects with AI models and receives context from enterprise databases to provide administrative and business responses 



# Diagrama de flujo api



# Diagrama General de flujo

````mermaid
flowchart TD
    Start([Inicio]) --> |Inicio de Sesión| Auth[Autenticación]
    Auth --> |POST /login| Login[Login Usuario]
    
    Start --> |Gestión de Usuarios| UserMgmt[Gestión de Usuarios]
    UserMgmt --> |POST /user| CreateUser[Crear Usuario]
    UserMgmt --> |GET /user| GetUser[Obtener Usuario]
    UserMgmt --> |PUT /user| UpdateUser[Actualizar Usuario]
    UserMgmt --> |GET /setActiveUser| ActivateUser[Activar Usuario]
    UserMgmt --> |GET /deleteUser| DeleteUser[Eliminar Usuario]
    
    Start --> |Gestión de Compañías| CompanyMgmt[Gestión de Compañías]
    CompanyMgmt --> |POST /company| CreateCompany[Crear Compañía]
    CompanyMgmt --> |GET /company| GetCompany[Obtener Compañía]
    CompanyMgmt --> |PUT /company| UpdateCompany[Actualizar Compañía]
    
    Start --> |Procesos IA| ProcessMgmt[Gestión de Procesos IA]
    ProcessMgmt --> |GET /proccess| GetProcess[Obtener Procesos]
    ProcessMgmt --> |POST /proccess| PostProcess[Procesar Prompt]
    
    Start --> |Consultas IA| IaQueries[Consultas IA]
    IaQueries --> |POST /responseAiGpt| QueryAssistant[Consulta Asistente IA]
    IaQueries --> |GET /bds| GetDBs[Obtener Bases de Datos]
    IaQueries --> |GET /tables| GetTables[Obtener Tablas]
    IaQueries --> |GET /ColumnsTables| GetColumns[Obtener Columnas]
    
    Start --> |KPIs| KPI[Gestión de KPIs]
    KPI --> |POST /kpi| CreateKPI[Crear KPI]
    KPI --> |GET /kpi| GetKPI[Obtener KPI]
    KPI --> |PUT /kpi| UpdateKPI[Actualizar KPI]
    
    Start --> |Gráficos| Graph[Gestión de Gráficos]
    Graph --> |POST /graph| CreateGraph[Crear Gráfico]
    Graph --> |GET /graph| GetGraph[Obtener Gráfico]
    Graph --> |PUT /graph| UpdateGraph[Actualizar Gráfico]
    
    Start --> |Exportación de Consultas| Export[Exportación de Consultas]
    Export --> |POST /exportQuery| ExportQuery[Exportar Consulta]
    
    Auth --> UserMgmt
    UserMgmt --> CompanyMgmt
    CompanyMgmt --> ProcessMgmt
    ProcessMgmt --> IaQueries
    IaQueries --> KPI
    KPI --> Graph
    Graph --> Export



````

# Diagrama de modelos de datos

````mermaid
erDiagram
    User {
        int id
        string fullName
        string email
        string password
        int planId
        int roleId
        boolean hasPaidSubscription
        boolean isActive
        boolean isDeleted
        timestamp lastLoginAt
        string profilePictureUrl
        jsonb preferences
        datetime createdAt
        datetime updatedAt
    }

    Role {
        int id
        string name
        datetime createdAt
        datetime updatedAt
    }

    Plan {
        int id
        int tokenLimit
        int promptLimit
        decimal subscriptionPrice
        string subscriptionDescription
        boolean isActive
        boolean isDeleted
        datetime createdAt
        datetime updatedAt
    }

    Company {
        int id
        string databaseUsername
        string databaseName
        json databaseSchema
        string databasePassword
        string dbm
        bigint nit
        string databaseHost
        boolean isActive
        boolean isDeleted
        datetime createdAt
        datetime updatedAt
    }

    KPI {
        int id
        string name
        string title
        int userId
        float value
        string period
        string region
        string productCategory
        datetime createdAt
        datetime updatedAt
    }

    MessageHistory {
        int id
        string prompt
        string response
        enum messageType
        int userId
        jsonb metadata
        boolean isProcessed
        datetime createdAt
        datetime updatedAt
    }

    Proccess {
        int id
        string prompt
        string response
        boolean match
        int userId
        string query
        jsonb metadata
        datetime createdAt
        datetime updatedAt
    }

    User ||--|| Role : "has"
    User ||--|| Plan : "subscribed to"
    User ||--o{ MessageHistory : "creates"
    User ||--o{ KPI : "manages"
    User ||--o{ Proccess : "initiates"
    Company ||--o{ User : "has many"
    Company ||--o{ Plan : "offers"


````



