create table "public"."GardenObjects" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "object_component_type" text not null,
    "object_scene_position" text,
    "user_id" uuid not null
);

CREATE UNIQUE INDEX "GardenObjects_pkey" ON public."GardenObjects" USING btree (id);

alter table
    "public"."GardenObjects"
add
    constraint "GardenObjects_pkey" PRIMARY KEY using index "GardenObjects_pkey";

alter table
    "public"."GardenObjects"
add
    constraint "GardenObjects_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table
    "public"."GardenObjects" validate constraint "GardenObjects_user_id_fkey";

grant delete on table "public"."GardenObjects" to "anon";

grant
insert
    on table "public"."GardenObjects" to "anon";

grant references on table "public"."GardenObjects" to "anon";

grant
select
    on table "public"."GardenObjects" to "anon";

grant trigger on table "public"."GardenObjects" to "anon";

grant truncate on table "public"."GardenObjects" to "anon";

grant
update
    on table "public"."GardenObjects" to "anon";

grant delete on table "public"."GardenObjects" to "authenticated";

grant
insert
    on table "public"."GardenObjects" to "authenticated";

grant references on table "public"."GardenObjects" to "authenticated";

grant
select
    on table "public"."GardenObjects" to "authenticated";

grant trigger on table "public"."GardenObjects" to "authenticated";

grant truncate on table "public"."GardenObjects" to "authenticated";

grant
update
    on table "public"."GardenObjects" to "authenticated";

grant delete on table "public"."GardenObjects" to "service_role";

grant
insert
    on table "public"."GardenObjects" to "service_role";

grant references on table "public"."GardenObjects" to "service_role";

grant
select
    on table "public"."GardenObjects" to "service_role";

grant trigger on table "public"."GardenObjects" to "service_role";

grant truncate on table "public"."GardenObjects" to "service_role";

grant
update
    on table "public"."GardenObjects" to "service_role";