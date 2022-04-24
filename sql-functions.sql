CREATE OR REPLACE FUNCTION getTimetable(_vk_id INTEGER) RETURNS JSONB
AS
$timetable$
DECLARE
timetable JSONB;
BEGIN
	IF NOT public.studentexists(_vk_id)
		THEN RAISE EXCEPTION 'Студента с id % не существует', _vk_id;
	END IF;

	SELECT subg.subgroup_timetable INTO timetable FROM public.student as st
	JOIN public.subgroup as subg
	ON subg.subgroup_id = st.subgroup_id
	WHERE st.vk_id = _vk_id;

	UPDATE public.student as st SET last_seen = CURRENT_DATE WHERE st.vk_id = _vk_id;

	RETURN timetable;
END;
$timetable$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION studentExists(_vk_id INTEGER) RETURNS BOOLEAN
AS
$$
BEGIN
	RETURN EXISTS(SELECT * FROM public.student WHERE vk_id = _vk_id);
END;
$$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION subgroupExists(_subgroup_id INTEGER) RETURNS BOOLEAN
AS
$$
BEGIN
	RETURN EXISTS(SELECT * FROM public.subgroup WHERE subgroup_id = _subgroup_id);
END;
$$
LANGUAGE plpgsql;

RAISE EXCEPTION 'Студента с id % не существует', _vk_id;