CREATE OR REPLACE PROCEDURE createStudent(_vk_id INTEGER, _subgroup_id INTEGER)
LANGUAGE plpgsql
AS $$
BEGIN
	IF NOT public.subgroupexists(_subgroup_id)
		THEN RAISE EXCEPTION 'Подгруппа с id = % не существует', _subgroup_id;
	END IF;
	IF public.studentexists(_vk_id)
		THEN RAISE EXCEPTION 'Студент с id = % уже существует', _vk_id;
	END IF;

   	INSERT INTO public.student (vk_id, subgroup_id, last_seen)
   	VALUES (_vk_id, _subgroup_id, CURRENT_DATE);
END;
$$;