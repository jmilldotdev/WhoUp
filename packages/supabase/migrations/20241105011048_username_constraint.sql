ALTER TABLE "public"."Profiles" 
ADD CONSTRAINT username_length_check 
CHECK (char_length(username) <= 32); 