create table "public"."BroadcastUsers" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null default gen_random_uuid(),
    "broadcast_id" uuid not null default gen_random_uuid(),
    "is_active" boolean not null default true
);

create table "public"."Broadcasts" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "is_active" boolean not null default true,
    "user_id" uuid not null default gen_random_uuid()
);

create table "public"."ConnectionInstance" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "connection_id" uuid
);

create table "public"."Connections" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null default gen_random_uuid(),
    "connected_user_id" uuid not null default gen_random_uuid(),
    "asset_url" text
);

create table "public"."Notifications" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "body" text not null,
    "data" jsonb,
    "read" boolean not null default false,
    "type" text not null,
    "action_url" text
);

create table "public"."PushSubscriptions" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null default gen_random_uuid(),
    "endpoint" text not null,
    "p256dh" text not null,
    "auth" text not null,
    "is_active" boolean not null default true
);

CREATE UNIQUE INDEX "BroadcastUsers_pkey" ON public."BroadcastUsers" USING btree (id);

CREATE UNIQUE INDEX "Broadcasts_pkey" ON public."Broadcasts" USING btree (id);

CREATE UNIQUE INDEX "ConnectionInstance_pkey" ON public."ConnectionInstance" USING btree (id);

CREATE UNIQUE INDEX "Connections_pkey" ON public."Connections" USING btree (id);

CREATE UNIQUE INDEX "Notifications_pkey" ON public."Notifications" USING btree (id);

CREATE UNIQUE INDEX "PushSubscriptions_pkey" ON public."PushSubscriptions" USING btree (id);

CREATE UNIQUE INDEX "PushSubscriptions_endpoint_key" ON public."PushSubscriptions" USING btree (endpoint);

alter table
    "public"."BroadcastUsers"
add
    constraint "BroadcastUsers_pkey" PRIMARY KEY using index "BroadcastUsers_pkey";

alter table
    "public"."Broadcasts"
add
    constraint "Broadcasts_pkey" PRIMARY KEY using index "Broadcasts_pkey";

alter table
    "public"."ConnectionInstance"
add
    constraint "ConnectionInstance_pkey" PRIMARY KEY using index "ConnectionInstance_pkey";

alter table
    "public"."Connections"
add
    constraint "Connections_pkey" PRIMARY KEY using index "Connections_pkey";

alter table
    "public"."Notifications"
add
    constraint "Notifications_pkey" PRIMARY KEY using index "Notifications_pkey";

alter table
    "public"."PushSubscriptions"
add
    constraint "PushSubscriptions_pkey" PRIMARY KEY using index "PushSubscriptions_pkey";

alter table
    "public"."BroadcastUsers"
add
    constraint "BroadcastUsers_broadcast_id_fkey" FOREIGN KEY (broadcast_id) REFERENCES "Broadcasts"(id) not valid;

alter table
    "public"."BroadcastUsers" validate constraint "BroadcastUsers_broadcast_id_fkey";

alter table
    "public"."BroadcastUsers"
add
    constraint "BroadcastUsers_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table
    "public"."BroadcastUsers" validate constraint "BroadcastUsers_user_id_fkey";

alter table
    "public"."Broadcasts"
add
    constraint "Broadcasts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table
    "public"."Broadcasts" validate constraint "Broadcasts_user_id_fkey";

alter table
    "public"."ConnectionInstance"
add
    constraint "ConnectionInstance_connection_id_fkey" FOREIGN KEY (connection_id) REFERENCES "Connections"(id) not valid;

alter table
    "public"."ConnectionInstance" validate constraint "ConnectionInstance_connection_id_fkey";

alter table
    "public"."Connections"
add
    constraint "Connections_connected_user_id_fkey" FOREIGN KEY (connected_user_id) REFERENCES auth.users(id) not valid;

alter table
    "public"."Connections" validate constraint "Connections_connected_user_id_fkey";

alter table
    "public"."Connections"
add
    constraint "Connections_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table
    "public"."Connections" validate constraint "Connections_user_id_fkey";

alter table
    "public"."Notifications"
add
    constraint "Notifications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table
    "public"."Notifications" validate constraint "Notifications_user_id_fkey";

alter table
    "public"."PushSubscriptions"
add
    constraint "PushSubscriptions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table
    "public"."PushSubscriptions" validate constraint "PushSubscriptions_user_id_fkey";

grant delete on table "public"."BroadcastUsers" to "anon";

grant
insert
    on table "public"."BroadcastUsers" to "anon";

grant references on table "public"."BroadcastUsers" to "anon";

grant
select
    on table "public"."BroadcastUsers" to "anon";

grant trigger on table "public"."BroadcastUsers" to "anon";

grant truncate on table "public"."BroadcastUsers" to "anon";

grant
update
    on table "public"."BroadcastUsers" to "anon";

grant delete on table "public"."BroadcastUsers" to "authenticated";

grant
insert
    on table "public"."BroadcastUsers" to "authenticated";

grant references on table "public"."BroadcastUsers" to "authenticated";

grant
select
    on table "public"."BroadcastUsers" to "authenticated";

grant trigger on table "public"."BroadcastUsers" to "authenticated";

grant truncate on table "public"."BroadcastUsers" to "authenticated";

grant
update
    on table "public"."BroadcastUsers" to "authenticated";

grant delete on table "public"."BroadcastUsers" to "service_role";

grant
insert
    on table "public"."BroadcastUsers" to "service_role";

grant references on table "public"."BroadcastUsers" to "service_role";

grant
select
    on table "public"."BroadcastUsers" to "service_role";

grant trigger on table "public"."BroadcastUsers" to "service_role";

grant truncate on table "public"."BroadcastUsers" to "service_role";

grant
update
    on table "public"."BroadcastUsers" to "service_role";

grant delete on table "public"."Broadcasts" to "anon";

grant
insert
    on table "public"."Broadcasts" to "anon";

grant references on table "public"."Broadcasts" to "anon";

grant
select
    on table "public"."Broadcasts" to "anon";

grant trigger on table "public"."Broadcasts" to "anon";

grant truncate on table "public"."Broadcasts" to "anon";

grant
update
    on table "public"."Broadcasts" to "anon";

grant delete on table "public"."Broadcasts" to "authenticated";

grant
insert
    on table "public"."Broadcasts" to "authenticated";

grant references on table "public"."Broadcasts" to "authenticated";

grant
select
    on table "public"."Broadcasts" to "authenticated";

grant trigger on table "public"."Broadcasts" to "authenticated";

grant truncate on table "public"."Broadcasts" to "authenticated";

grant
update
    on table "public"."Broadcasts" to "authenticated";

grant delete on table "public"."Broadcasts" to "service_role";

grant
insert
    on table "public"."Broadcasts" to "service_role";

grant references on table "public"."Broadcasts" to "service_role";

grant
select
    on table "public"."Broadcasts" to "service_role";

grant trigger on table "public"."Broadcasts" to "service_role";

grant truncate on table "public"."Broadcasts" to "service_role";

grant
update
    on table "public"."Broadcasts" to "service_role";

grant delete on table "public"."ConnectionInstance" to "anon";

grant
insert
    on table "public"."ConnectionInstance" to "anon";

grant references on table "public"."ConnectionInstance" to "anon";

grant
select
    on table "public"."ConnectionInstance" to "anon";

grant trigger on table "public"."ConnectionInstance" to "anon";

grant truncate on table "public"."ConnectionInstance" to "anon";

grant
update
    on table "public"."ConnectionInstance" to "anon";

grant delete on table "public"."ConnectionInstance" to "authenticated";

grant
insert
    on table "public"."ConnectionInstance" to "authenticated";

grant references on table "public"."ConnectionInstance" to "authenticated";

grant
select
    on table "public"."ConnectionInstance" to "authenticated";

grant trigger on table "public"."ConnectionInstance" to "authenticated";

grant truncate on table "public"."ConnectionInstance" to "authenticated";

grant
update
    on table "public"."ConnectionInstance" to "authenticated";

grant delete on table "public"."ConnectionInstance" to "service_role";

grant
insert
    on table "public"."ConnectionInstance" to "service_role";

grant references on table "public"."ConnectionInstance" to "service_role";

grant
select
    on table "public"."ConnectionInstance" to "service_role";

grant trigger on table "public"."ConnectionInstance" to "service_role";

grant truncate on table "public"."ConnectionInstance" to "service_role";

grant
update
    on table "public"."ConnectionInstance" to "service_role";

grant delete on table "public"."Connections" to "anon";

grant
insert
    on table "public"."Connections" to "anon";

grant references on table "public"."Connections" to "anon";

grant
select
    on table "public"."Connections" to "anon";

grant trigger on table "public"."Connections" to "anon";

grant truncate on table "public"."Connections" to "anon";

grant
update
    on table "public"."Connections" to "anon";

grant delete on table "public"."Connections" to "authenticated";

grant
insert
    on table "public"."Connections" to "authenticated";

grant references on table "public"."Connections" to "authenticated";

grant
select
    on table "public"."Connections" to "authenticated";

grant trigger on table "public"."Connections" to "authenticated";

grant truncate on table "public"."Connections" to "authenticated";

grant
update
    on table "public"."Connections" to "authenticated";

grant delete on table "public"."Connections" to "service_role";

grant
insert
    on table "public"."Connections" to "service_role";

grant references on table "public"."Connections" to "service_role";

grant
select
    on table "public"."Connections" to "service_role";

grant trigger on table "public"."Connections" to "service_role";

grant truncate on table "public"."Connections" to "service_role";

grant
update
    on table "public"."Connections" to "service_role";

grant delete on table "public"."Notifications" to "anon";

grant
insert
    on table "public"."Notifications" to "anon";

grant references on table "public"."Notifications" to "anon";

grant
select
    on table "public"."Notifications" to "anon";

grant trigger on table "public"."Notifications" to "anon";

grant truncate on table "public"."Notifications" to "anon";

grant
update
    on table "public"."Notifications" to "anon";

grant delete on table "public"."Notifications" to "authenticated";

grant
insert
    on table "public"."Notifications" to "authenticated";

grant references on table "public"."Notifications" to "authenticated";

grant
select
    on table "public"."Notifications" to "authenticated";

grant trigger on table "public"."Notifications" to "authenticated";

grant truncate on table "public"."Notifications" to "authenticated";

grant
update
    on table "public"."Notifications" to "authenticated";

grant delete on table "public"."Notifications" to "service_role";

grant
insert
    on table "public"."Notifications" to "service_role";

grant references on table "public"."Notifications" to "service_role";

grant
select
    on table "public"."Notifications" to "service_role";

grant trigger on table "public"."Notifications" to "service_role";

grant truncate on table "public"."Notifications" to "service_role";

grant
update
    on table "public"."Notifications" to "service_role";

grant delete on table "public"."PushSubscriptions" to "anon";

grant
insert
    on table "public"."PushSubscriptions" to "anon";

grant references on table "public"."PushSubscriptions" to "anon";

grant
select
    on table "public"."PushSubscriptions" to "anon";

grant trigger on table "public"."PushSubscriptions" to "anon";

grant truncate on table "public"."PushSubscriptions" to "anon";

grant
update
    on table "public"."PushSubscriptions" to "anon";

grant delete on table "public"."PushSubscriptions" to "authenticated";

grant
insert
    on table "public"."PushSubscriptions" to "authenticated";

grant references on table "public"."PushSubscriptions" to "authenticated";

grant
select
    on table "public"."PushSubscriptions" to "authenticated";

grant trigger on table "public"."PushSubscriptions" to "authenticated";

grant truncate on table "public"."PushSubscriptions" to "authenticated";

grant
update
    on table "public"."PushSubscriptions" to "authenticated";

grant delete on table "public"."PushSubscriptions" to "service_role";

grant
insert
    on table "public"."PushSubscriptions" to "service_role";

grant references on table "public"."PushSubscriptions" to "service_role";

grant
select
    on table "public"."PushSubscriptions" to "service_role";

grant trigger on table "public"."PushSubscriptions" to "service_role";

grant truncate on table "public"."PushSubscriptions" to "service_role";

grant
update
    on table "public"."PushSubscriptions" to "service_role";