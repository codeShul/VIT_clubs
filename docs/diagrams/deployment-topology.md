# VIT Clubs — Network & Deployment Topology

This diagram details the cloud infrastructure topology, edge networking, connection pooling, and multi-region deployment setup across Vercel and Supabase.

```mermaid
flowchart LR
    subgraph Internet["Public Internet"]
        ClientBrowser["Client Browser<br/>(Desktop / Mobile)"]
    end

    subgraph VercelCloud["Vercel Cloud Infrastructure"]
        VercelEdge["Vercel Anycast Edge Network<br/>• TLS 1.3 Termination<br/>• Edge DDoS Protection<br/>• Edge Middleware (Global Proxies)"]
        
        ServerlessApp["Serverless Compute (Region: iad1)<br/>• Next.js 16 App Router Server Components<br/>• Next.js Server Actions<br/>• NextAuth API Engine"]
    end

    subgraph SupabaseCloud["Supabase Managed Cloud (AWS ap-northeast-2)"]
        PgBouncerService["PgBouncer Connection Pooler<br/>Port 6543 (Transaction-Mode)<br/>DATABASE_URL (Spike protection)"]
        PostgresInstance["Direct PostgreSQL Engine<br/>Port 5432 (Session-Mode)<br/>DIRECT_URL (Prisma CLI & migrations)"]
        StorageCluster["S3-Compatible Object Store<br/>Banners, Logos & Attachments"]
    end

    ClientBrowser -->|"HTTPS :443"| VercelEdge
    VercelEdge -->|"Internal Route"| ServerlessApp
    ServerlessApp -->|"Prisma Adapter-PG (Port 6543)"| PgBouncerService
    ServerlessApp -.->|"Migrations (Port 5432)"| PostgresInstance
    PgBouncerService -->|"Localhost IPC"| PostgresInstance
    ClientBrowser -.->|"Direct Image GET"| StorageCluster
```
