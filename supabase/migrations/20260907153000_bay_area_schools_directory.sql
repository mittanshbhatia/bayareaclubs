-- Persist the Bay Area school directory and allow students to claim
-- a student membership at an active school when starting a club.
-- Schools are production directory rows, not client-side fixtures.

create or replace function public.claim_student_school_membership(
  target_school_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  membership_id uuid;
  membership_status public.membership_status;
begin
  if actor is null then
    raise exception 'Authentication required';
  end if;

  if not exists (
    select 1
    from public.account_onboarding onboarding
    where onboarding.user_id = actor
      and onboarding.status = 'active'
  ) then
    raise exception 'Account activation is required';
  end if;

  if not exists (
    select 1
    from public.schools school
    where school.id = target_school_id
      and school.is_active
  ) then
    raise exception 'School is not available';
  end if;

  select membership.id, membership.status
    into membership_id, membership_status
  from public.user_school_memberships membership
  where membership.user_id = actor
    and membership.school_id = target_school_id
    and membership.role = 'student';

  if membership_id is not null then
    if membership_status = 'suspended' then
      raise exception 'School membership is suspended';
    end if;
    if membership_status is distinct from 'active' then
      update public.user_school_memberships
      set
        status = 'active',
        exited_at = null,
        joined_at = coalesce(joined_at, statement_timestamp()),
        updated_at = statement_timestamp()
      where id = membership_id;
    end if;
    return membership_id;
  end if;

  insert into public.user_school_memberships (
    user_id,
    school_id,
    role,
    status,
    joined_at
  )
  values (
    actor,
    target_school_id,
    'student',
    'active',
    statement_timestamp()
  )
  returning id into membership_id;

  return membership_id;
end;
$$;

comment on function public.claim_student_school_membership(uuid) is
  'Lets an active authenticated user persist a student membership at an active school. Does not grant school_admin, school_advisor, or staff.';

revoke all on function public.claim_student_school_membership(uuid) from public;
revoke all on function public.claim_student_school_membership(uuid) from anon;
grant execute on function public.claim_student_school_membership(uuid) to authenticated;

insert into public.schools (name, slug, level, city, website_url, is_active)
values
  ('BayAreaClubs Demo High School', 'bayareaclubs-demo-high-school', 'high'::public.school_level, 'Cupertino', null, true),
  ('Bellarmine College Preparatory', 'bellarmine-college-preparatory', 'high'::public.school_level, 'San Jose', 'https://www.bcp.org/', true),
  ('BASIS Independent Silicon Valley', 'basis-independent-silicon-valley', 'other'::public.school_level, 'San Jose', 'https://basisindependent.com/schools/ca/silicon-valley/', true),
  ('The Harker School', 'the-harker-school', 'other'::public.school_level, 'San Jose', 'https://www.harker.org/', true),
  ('Homestead High School', 'homestead-high-school', 'high'::public.school_level, 'Cupertino', 'https://hhs.fuhsd.org/', true),
  ('Cupertino High School', 'cupertino-high-school', 'high'::public.school_level, 'Cupertino', 'https://chs.fuhsd.org/', true),
  ('Abraham Lincoln High School', 'abraham-lincoln-high-school', 'high'::public.school_level, 'San Francisco', 'https://www.lincolnmustang.org/', true),
  ('Balboa High School', 'balboa-high-school', 'high'::public.school_level, 'San Francisco', 'https://www.sfusd.edu/school/balboa-high-school', true),
  ('Phillip and Sala Burton Academic High School', 'phillip-and-sala-burton-academic-high-school', 'high'::public.school_level, 'San Francisco', 'https://www.sfusd.edu/school/burton-high-school', true),
  ('Downtown High School', 'downtown-high-school', 'high'::public.school_level, 'San Francisco', 'https://www.sfusd.edu/school/downtown-high-school', true),
  ('Galileo Academy of Science and Technology', 'galileo-academy-of-science-and-technology', 'high'::public.school_level, 'San Francisco', 'https://www.galileoweb.org/', true),
  ('Ida B. Wells High School', 'ida-b-wells-high-school', 'high'::public.school_level, 'San Francisco', 'https://www.sfusd.edu/school/ida-b-wells-high-school', true),
  ('Independence High School', 'independence-high-school', 'high'::public.school_level, 'San Francisco', 'https://www.sfusd.edu/school/independence-high-school', true),
  ('June Jordan School for Equity', 'june-jordan-school-for-equity', 'high'::public.school_level, 'San Francisco', 'https://www.jjse.org/', true),
  ('Lowell High School', 'lowell-high-school', 'high'::public.school_level, 'San Francisco', 'https://www.sfusd.edu/school/lowell-high-school', true),
  ('Mission High School', 'mission-high-school', 'high'::public.school_level, 'San Francisco', 'https://www.sfusd.edu/school/mission-high-school', true),
  ('John O''Connell High School', 'john-o-connell-high-school', 'high'::public.school_level, 'San Francisco', 'https://www.sfusd.edu/school/john-oconnell-high-school', true),
  ('Ruth Asawa San Francisco School of the Arts', 'ruth-asawa-san-francisco-school-of-the-arts', 'high'::public.school_level, 'San Francisco', 'https://www.sfsota.org/', true),
  ('The Academy - San Francisco at McAteer', 'the-academy-san-francisco-at-mcateer', 'high'::public.school_level, 'San Francisco', 'https://www.sfusd.edu/school/academy-san-francisco-mcateer', true),
  ('Thurgood Marshall Academic High School', 'thurgood-marshall-academic-high-school', 'high'::public.school_level, 'San Francisco', 'https://www.sfusd.edu/school/thurgood-marshall-academic-high-school', true),
  ('George Washington High School', 'george-washington-high-school', 'high'::public.school_level, 'San Francisco', 'https://www.sfusd.edu/school/george-washington-high-school', true),
  ('Raoul Wallenberg High School', 'raoul-wallenberg-high-school', 'high'::public.school_level, 'San Francisco', 'https://www.sfusd.edu/school/raoul-wallenberg-traditional-high-school', true),
  ('San Francisco International High School', 'san-francisco-international-high-school', 'high'::public.school_level, 'San Francisco', 'https://www.sfusd.edu/school/san-francisco-international-high-school', true),
  ('Gateway High School', 'gateway-high-school', 'high'::public.school_level, 'San Francisco', 'https://www.gatewaypublicschools.org/ghs', true),
  ('KIPP San Francisco College Preparatory', 'kipp-san-francisco-college-preparatory', 'high'::public.school_level, 'San Francisco', 'https://www.kippbayarea.org/', true),
  ('City Arts and Technology High School', 'city-arts-and-technology-high-school', 'high'::public.school_level, 'San Francisco', 'https://www.envisionschools.org/cat', true),
  ('Leadership High School', 'leadership-high-school', 'high'::public.school_level, 'San Francisco', 'https://www.leadershihigh.org/', true),
  ('Aragon High School', 'aragon-high-school', 'high'::public.school_level, 'San Mateo', 'https://www.ahs.smuhsd.org/', true),
  ('Burlingame High School', 'burlingame-high-school', 'high'::public.school_level, 'Burlingame', 'https://www.bhs.smuhsd.org/', true),
  ('Capuchino High School', 'capuchino-high-school', 'high'::public.school_level, 'San Bruno', 'https://www.capuchino.smuhsd.org/', true),
  ('Hillsdale High School', 'hillsdale-high-school', 'high'::public.school_level, 'San Mateo', 'https://www.hillsdale.smuhsd.org/', true),
  ('Mills High School', 'mills-high-school', 'high'::public.school_level, 'Millbrae', 'https://www.mills.smuhsd.org/', true),
  ('San Mateo High School', 'san-mateo-high-school', 'high'::public.school_level, 'San Mateo', 'https://www.smhs.smuhsd.org/', true),
  ('Carlmont High School', 'carlmont-high-school', 'high'::public.school_level, 'Belmont', 'https://www.carlmont.seq.org/', true),
  ('Menlo-Atherton High School', 'menlo-atherton-high-school', 'high'::public.school_level, 'Atherton', 'https://www.mabears.org/', true),
  ('Sequoia High School', 'sequoia-high-school', 'high'::public.school_level, 'Redwood City', 'https://www.sequoiahs.org/', true),
  ('Woodside High School', 'woodside-high-school', 'high'::public.school_level, 'Woodside', 'https://www.woodsidehs.org/', true),
  ('East Palo Alto Academy', 'east-palo-alto-academy', 'high'::public.school_level, 'East Palo Alto', 'https://www.eastpaloaltoacademy.org/', true),
  ('Design Tech High School', 'design-tech-high-school', 'high'::public.school_level, 'Redwood City', 'https://www.designtechhighschool.org/', true),
  ('Summit Preparatory Charter High School', 'summit-preparatory-charter-high-school', 'high'::public.school_level, 'Redwood City', 'https://www.summitps.org/', true),
  ('El Camino High School', 'el-camino-high-school', 'high'::public.school_level, 'South San Francisco', 'https://www.echs.ssfusd.org/', true),
  ('South San Francisco High School', 'south-san-francisco-high-school', 'high'::public.school_level, 'South San Francisco', 'https://www.ssfhs.ssfusd.org/', true),
  ('Westmoor High School', 'westmoor-high-school', 'high'::public.school_level, 'Daly City', 'https://www.westmoor.juhsd.net/', true),
  ('Jefferson High School', 'jefferson-high-school', 'high'::public.school_level, 'Daly City', 'https://www.jefferson.juhsd.net/', true),
  ('Terra Nova High School', 'terra-nova-high-school', 'high'::public.school_level, 'Pacifica', 'https://www.terranova.juhsd.net/', true),
  ('Oceana High School', 'oceana-high-school', 'high'::public.school_level, 'Pacifica', 'https://www.oceana.juhsd.net/', true),
  ('Half Moon Bay High School', 'half-moon-bay-high-school', 'high'::public.school_level, 'Half Moon Bay', 'https://www.hmbhs.cabria.org/', true),
  ('Pescadero High School', 'pescadero-high-school', 'high'::public.school_level, 'Pescadero', 'https://www.lhusd.org/', true),
  ('TIDE Academy', 'tide-academy', 'high'::public.school_level, 'Menlo Park', 'https://www.tideacademy.org/', true),
  ('Palo Alto High School', 'palo-alto-high-school', 'high'::public.school_level, 'Palo Alto', 'https://www.paly.net/', true),
  ('Henry M. Gunn High School', 'henry-m-gunn-high-school', 'high'::public.school_level, 'Palo Alto', 'https://gunn.pausd.org/', true),
  ('Los Altos High School', 'los-altos-high-school', 'high'::public.school_level, 'Los Altos', 'https://www.losaltoshigh.org/', true),
  ('Mountain View High School', 'mountain-view-high-school', 'high'::public.school_level, 'Mountain View', 'https://www.mvhs.mvla.net/', true),
  ('Fremont High School', 'fremont-high-school', 'high'::public.school_level, 'Sunnyvale', 'https://fremont.fuhsd.org/', true),
  ('Lynbrook High School', 'lynbrook-high-school', 'high'::public.school_level, 'San Jose', 'https://lhs.fuhsd.org/', true),
  ('Monta Vista High School', 'monta-vista-high-school', 'high'::public.school_level, 'Cupertino', 'https://mvhs.fuhsd.org/', true),
  ('Saratoga High School', 'saratoga-high-school', 'high'::public.school_level, 'Saratoga', 'https://www.saratogahigh.org/', true),
  ('Los Gatos High School', 'los-gatos-high-school', 'high'::public.school_level, 'Los Gatos', 'https://www.lghs.net/', true),
  ('Leigh High School', 'leigh-high-school', 'high'::public.school_level, 'San Jose', 'https://leigh.cuhsd.org/', true),
  ('Westmont High School', 'westmont-high-school', 'high'::public.school_level, 'Campbell', 'https://westmont.cuhsd.org/', true),
  ('Prospect High School', 'prospect-high-school', 'high'::public.school_level, 'Saratoga', 'https://prospect.cuhsd.org/', true),
  ('Branham High School', 'branham-high-school', 'high'::public.school_level, 'San Jose', 'https://branham.cuhsd.org/', true),
  ('Del Mar High School', 'del-mar-high-school', 'high'::public.school_level, 'San Jose', 'https://delmar.cuhsd.org/', true),
  ('Wilcox High School', 'wilcox-high-school', 'high'::public.school_level, 'Santa Clara', 'https://wilcox.santaclarausd.org/', true),
  ('Santa Clara High School', 'santa-clara-high-school', 'high'::public.school_level, 'Santa Clara', 'https://santaclara.santaclarausd.org/', true),
  ('Milpitas High School', 'milpitas-high-school', 'high'::public.school_level, 'Milpitas', 'https://mhs.musd.org/', true),
  ('Independence High School San Jose', 'independence-high-school-san-jose', 'high'::public.school_level, 'San Jose', 'https://independence.esuhsd.org/', true),
  ('Piedmont Hills High School', 'piedmont-hills-high-school', 'high'::public.school_level, 'San Jose', 'https://piedmonthills.esuhsd.org/', true),
  ('Silver Creek High School', 'silver-creek-high-school', 'high'::public.school_level, 'San Jose', 'https://silvercreek.esuhsd.org/', true),
  ('Evergreen Valley High School', 'evergreen-valley-high-school', 'high'::public.school_level, 'San Jose', 'https://evergreenvalley.esuhsd.org/', true),
  ('Andrew Hill High School', 'andrew-hill-high-school', 'high'::public.school_level, 'San Jose', 'https://andrewhill.esuhsd.org/', true),
  ('Yerba Buena High School', 'yerba-buena-high-school', 'high'::public.school_level, 'San Jose', 'https://yerbabuena.esuhsd.org/', true),
  ('William C. Overfelt High School', 'william-c-overfelt-high-school', 'high'::public.school_level, 'San Jose', 'https://overfelt.esuhsd.org/', true),
  ('James Lick High School', 'james-lick-high-school', 'high'::public.school_level, 'San Jose', 'https://jameslick.esuhsd.org/', true),
  ('Gunderson High School', 'gunderson-high-school', 'high'::public.school_level, 'San Jose', 'https://gunderson.sjusd.org/', true),
  ('Leland High School', 'leland-high-school', 'high'::public.school_level, 'San Jose', 'https://leland.sjusd.org/', true),
  ('Oak Grove High School', 'oak-grove-high-school', 'high'::public.school_level, 'San Jose', 'https://oakgrove.sjusd.org/', true),
  ('Santa Teresa High School', 'santa-teresa-high-school', 'high'::public.school_level, 'San Jose', 'https://santateresa.sjusd.org/', true),
  ('Pioneer High School', 'pioneer-high-school', 'high'::public.school_level, 'San Jose', 'https://pioneer.sjusd.org/', true),
  ('Willow Glen High School', 'willow-glen-high-school', 'high'::public.school_level, 'San Jose', 'https://willowglen.sjusd.org/', true),
  ('Abraham Lincoln High School San Jose', 'abraham-lincoln-high-school-san-jose', 'high'::public.school_level, 'San Jose', 'https://lincoln.sjusd.org/', true),
  ('San Jose High School', 'san-jose-high-school', 'high'::public.school_level, 'San Jose', 'https://sanjose.sjusd.org/', true),
  ('Ann Sobrato High School', 'ann-sobrato-high-school', 'high'::public.school_level, 'Morgan Hill', 'https://sobrato.mhusd.org/', true),
  ('Live Oak High School', 'live-oak-high-school', 'high'::public.school_level, 'Morgan Hill', 'https://liveoak.mhusd.org/', true),
  ('Christopher High School', 'christopher-high-school', 'high'::public.school_level, 'Gilroy', 'https://chs.gilroyunified.org/', true),
  ('Gilroy High School', 'gilroy-high-school', 'high'::public.school_level, 'Gilroy', 'https://ghs.gilroyunified.org/', true),
  ('Dr. TJ Owens Gilroy Early College Academy', 'dr-tj-owens-gilroy-early-college-academy', 'high'::public.school_level, 'Gilroy', 'https://geca.gilroyunified.org/', true),
  ('KIPP San Jose Collegiate', 'kipp-san-jose-collegiate', 'high'::public.school_level, 'San Jose', 'https://www.kippbayarea.org/', true),
  ('Downtown College Prep', 'downtown-college-prep', 'high'::public.school_level, 'San Jose', 'https://www.dcp.org/', true),
  ('Berkeley High School', 'berkeley-high-school', 'high'::public.school_level, 'Berkeley', 'https://bhs.berkeleyschools.net/', true),
  ('Berkeley Technology Academy', 'berkeley-technology-academy', 'high'::public.school_level, 'Berkeley', 'https://bta.berkeleyschools.net/', true),
  ('Oakland Technical High School', 'oakland-technical-high-school', 'high'::public.school_level, 'Oakland', 'https://oaklandtech.com/', true),
  ('Oakland High School', 'oakland-high-school', 'high'::public.school_level, 'Oakland', 'https://oaklandhigh.org/', true),
  ('Skyline High School', 'skyline-high-school', 'high'::public.school_level, 'Oakland', 'https://skyline.ousd.org/', true),
  ('Castlemont High School', 'castlemont-high-school', 'high'::public.school_level, 'Oakland', 'https://castlemont.ousd.org/', true),
  ('Fremont High School Oakland', 'fremont-high-school-oakland', 'high'::public.school_level, 'Oakland', 'https://fremont.ousd.org/', true),
  ('Coliseum College Prep Academy', 'coliseum-college-prep-academy', 'high'::public.school_level, 'Oakland', 'https://ccpa.ousd.org/', true),
  ('Life Academy', 'life-academy', 'high'::public.school_level, 'Oakland', 'https://lifeacademy.ousd.org/', true),
  ('MetWest High School', 'metwest-high-school', 'high'::public.school_level, 'Oakland', 'https://metwest.ousd.org/', true),
  ('Oakland School for the Arts', 'oakland-school-for-the-arts', 'high'::public.school_level, 'Oakland', 'https://www.oakarts.org/', true),
  ('Oakland International High School', 'oakland-international-high-school', 'high'::public.school_level, 'Oakland', 'https://oaklandinternational.ousd.org/', true),
  ('Alameda High School', 'alameda-high-school', 'high'::public.school_level, 'Alameda', 'https://ahs.alamedaunified.org/', true),
  ('Encinal High School', 'encinal-high-school', 'high'::public.school_level, 'Alameda', 'https://ehs.alamedaunified.org/', true),
  ('San Leandro High School', 'san-leandro-high-school', 'high'::public.school_level, 'San Leandro', 'https://slhs.slusd.us/', true),
  ('Lincoln High School San Leandro', 'lincoln-high-school-san-leandro', 'high'::public.school_level, 'San Leandro', 'https://lhs.slusd.us/', true),
  ('Arroyo High School', 'arroyo-high-school', 'high'::public.school_level, 'San Lorenzo', 'https://ahs.slzusd.org/', true),
  ('San Lorenzo High School', 'san-lorenzo-high-school', 'high'::public.school_level, 'San Lorenzo', 'https://slzhs.slzusd.org/', true),
  ('East Bay Arts High School', 'east-bay-arts-high-school', 'high'::public.school_level, 'Hayward', 'https://eba.slzusd.org/', true),
  ('Castro Valley High School', 'castro-valley-high-school', 'high'::public.school_level, 'Castro Valley', 'https://cvhs.cv.k12.ca.us/', true),
  ('Hayward High School', 'hayward-high-school', 'high'::public.school_level, 'Hayward', 'https://haywardhigh.husd.k12.ca.us/', true),
  ('Mount Eden High School', 'mount-eden-high-school', 'high'::public.school_level, 'Hayward', 'https://mteden.husd.k12.ca.us/', true),
  ('Tennyson High School', 'tennyson-high-school', 'high'::public.school_level, 'Hayward', 'https://tennyson.husd.k12.ca.us/', true),
  ('James Logan High School', 'james-logan-high-school', 'high'::public.school_level, 'Union City', 'https://www.jameslogan.org/', true),
  ('Newark Memorial High School', 'newark-memorial-high-school', 'high'::public.school_level, 'Newark', 'https://nmhs.newarkunified.org/', true),
  ('American High School', 'american-high-school', 'high'::public.school_level, 'Fremont', 'https://american.fremont.k12.ca.us/', true),
  ('Irvington High School', 'irvington-high-school', 'high'::public.school_level, 'Fremont', 'https://irvington.fremont.k12.ca.us/', true),
  ('Mission San Jose High School', 'mission-san-jose-high-school', 'high'::public.school_level, 'Fremont', 'https://missionsanjose.fremont.k12.ca.us/', true),
  ('John F. Kennedy High School Fremont', 'john-f-kennedy-high-school-fremont', 'high'::public.school_level, 'Fremont', 'https://kennedy.fremont.k12.ca.us/', true),
  ('Washington High School Fremont', 'washington-high-school-fremont', 'high'::public.school_level, 'Fremont', 'https://washington.fremont.k12.ca.us/', true),
  ('Dublin High School', 'dublin-high-school', 'high'::public.school_level, 'Dublin', 'https://www.dublinusd.org/dhs', true),
  ('Emerald High School', 'emerald-high-school', 'high'::public.school_level, 'Dublin', 'https://www.dublinusd.org/ehs', true),
  ('Livermore High School', 'livermore-high-school', 'high'::public.school_level, 'Livermore', 'https://www.livermorehighschool.net/', true),
  ('Granada High School', 'granada-high-school', 'high'::public.school_level, 'Livermore', 'https://www.granadahighschool.net/', true),
  ('Amador Valley High School', 'amador-valley-high-school', 'high'::public.school_level, 'Pleasanton', 'https://www.amador.pleasantonusd.net/', true),
  ('Foothill High School Pleasanton', 'foothill-high-school-pleasanton', 'high'::public.school_level, 'Pleasanton', 'https://www.foothill.pleasantonusd.net/', true),
  ('Albany High School', 'albany-high-school', 'high'::public.school_level, 'Albany', 'https://ahs.ausdk12.org/', true),
  ('Piedmont High School', 'piedmont-high-school', 'high'::public.school_level, 'Piedmont', 'https://www.piedmont.k12.ca.us/phs', true),
  ('Emery Secondary School', 'emery-secondary-school', 'high'::public.school_level, 'Emeryville', 'https://www.emeryusd.org/', true),
  ('Acalanes High School', 'acalanes-high-school', 'high'::public.school_level, 'Lafayette', 'https://www.acalanes.k12.ca.us/ahl', true),
  ('Campolindo High School', 'campolindo-high-school', 'high'::public.school_level, 'Moraga', 'https://www.acalanes.k12.ca.us/campolindo', true),
  ('Miramonte High School', 'miramonte-high-school', 'high'::public.school_level, 'Orinda', 'https://www.acalanes.k12.ca.us/miramonte', true),
  ('Las Lomas High School', 'las-lomas-high-school', 'high'::public.school_level, 'Walnut Creek', 'https://www.acalanes.k12.ca.us/laslomas', true),
  ('Acalanes Center for Independent Study', 'acalanes-center-for-independent-study', 'high'::public.school_level, 'Walnut Creek', 'https://www.acalanes.k12.ca.us/', true),
  ('Northgate High School', 'northgate-high-school', 'high'::public.school_level, 'Walnut Creek', 'https://www.mdusd.org/northgate', true),
  ('College Park High School', 'college-park-high-school', 'high'::public.school_level, 'Pleasant Hill', 'https://www.mdusd.org/collegepark', true),
  ('Clayton Valley Charter High School', 'clayton-valley-charter-high-school', 'high'::public.school_level, 'Concord', 'https://www.claytonvalley.org/', true),
  ('Concord High School', 'concord-high-school', 'high'::public.school_level, 'Concord', 'https://www.mdusd.org/concord', true),
  ('Mount Diablo High School', 'mount-diablo-high-school', 'high'::public.school_level, 'Concord', 'https://www.mdusd.org/mdhs', true),
  ('Ygnacio Valley High School', 'ygnacio-valley-high-school', 'high'::public.school_level, 'Concord', 'https://www.mdusd.org/yvhs', true),
  ('De Anza High School', 'de-anza-high-school', 'high'::public.school_level, 'Richmond', 'https://www.wccusd.net/deanza', true),
  ('El Cerrito High School', 'el-cerrito-high-school', 'high'::public.school_level, 'El Cerrito', 'https://www.wccusd.net/elcerrito', true),
  ('Hercules High School', 'hercules-high-school', 'high'::public.school_level, 'Hercules', 'https://www.wccusd.net/hercules', true),
  ('Pinole Valley High School', 'pinole-valley-high-school', 'high'::public.school_level, 'Pinole', 'https://www.wccusd.net/pinolevalley', true),
  ('John F. Kennedy High School Richmond', 'john-f-kennedy-high-school-richmond', 'high'::public.school_level, 'Richmond', 'https://www.wccusd.net/kennedy', true),
  ('Richmond High School', 'richmond-high-school', 'high'::public.school_level, 'Richmond', 'https://www.wccusd.net/richmond', true),
  ('Middle College High School', 'middle-college-high-school', 'high'::public.school_level, 'San Pablo', 'https://www.wccusd.net/', true),
  ('Freedom High School', 'freedom-high-school', 'high'::public.school_level, 'Oakley', 'https://freedom.luhsd.net/', true),
  ('Liberty High School', 'liberty-high-school', 'high'::public.school_level, 'Brentwood', 'https://liberty.luhsd.net/', true),
  ('Heritage High School', 'heritage-high-school', 'high'::public.school_level, 'Brentwood', 'https://heritage.luhsd.net/', true),
  ('Antioch High School', 'antioch-high-school', 'high'::public.school_level, 'Antioch', 'https://www.antiochschools.net/ahs', true),
  ('Deer Valley High School', 'deer-valley-high-school', 'high'::public.school_level, 'Antioch', 'https://www.antiochschools.net/dvhs', true),
  ('Dozier-Libbey Medical High School', 'dozier-libbey-medical-high-school', 'high'::public.school_level, 'Antioch', 'https://www.antiochschools.net/dlmhs', true),
  ('Pittsburg High School', 'pittsburg-high-school', 'high'::public.school_level, 'Pittsburg', 'https://phs.pittsburg.k12.ca.us/', true),
  ('Alhambra High School', 'alhambra-high-school', 'high'::public.school_level, 'Martinez', 'https://alhambra.mdusd.org/', true),
  ('John Swett High School', 'john-swett-high-school', 'high'::public.school_level, 'Crockett', 'https://www.jscuhsd.org/', true),
  ('San Ramon Valley High School', 'san-ramon-valley-high-school', 'high'::public.school_level, 'Danville', 'https://www.srvhs.srvusd.net/', true),
  ('California High School', 'california-high-school', 'high'::public.school_level, 'San Ramon', 'https://www.calhigh.net/', true),
  ('Dougherty Valley High School', 'dougherty-valley-high-school', 'high'::public.school_level, 'San Ramon', 'https://www.dvhigh.net/', true),
  ('Monte Vista High School', 'monte-vista-high-school', 'high'::public.school_level, 'Danville', 'https://www.mvhigh.net/', true),
  ('Redwood High School', 'redwood-high-school', 'high'::public.school_level, 'Larkspur', 'https://www.redwood.org/', true),
  ('Tamalpais High School', 'tamalpais-high-school', 'high'::public.school_level, 'Mill Valley', 'https://www.tamhigh.org/', true),
  ('Archie Williams High School', 'archie-williams-high-school', 'high'::public.school_level, 'San Anselmo', 'https://www.archiewilliams.org/', true),
  ('Terra Linda High School', 'terra-linda-high-school', 'high'::public.school_level, 'San Rafael', 'https://www.terralinda.org/', true),
  ('San Rafael High School', 'san-rafael-high-school', 'high'::public.school_level, 'San Rafael', 'https://www.sanrafaelhigh.org/', true),
  ('Novato High School', 'novato-high-school', 'high'::public.school_level, 'Novato', 'https://www.novatohigh.org/', true),
  ('San Marin High School', 'san-marin-high-school', 'high'::public.school_level, 'Novato', 'https://www.sanmarin.org/', true),
  ('Tamiscal High School', 'tamiscal-high-school', 'high'::public.school_level, 'Larkspur', 'https://www.tamdistrict.org/tamiscal', true),
  ('Tomales High School', 'tomales-high-school', 'high'::public.school_level, 'Tomales', 'https://www.shusd.org/', true),
  ('Vacaville High School', 'vacaville-high-school', 'high'::public.school_level, 'Vacaville', 'https://vhs.vacavilleusd.org/', true),
  ('Will C. Wood High School', 'will-c-wood-high-school', 'high'::public.school_level, 'Vacaville', 'https://wcw.vacavilleusd.org/', true),
  ('Vanden High School', 'vanden-high-school', 'high'::public.school_level, 'Fairfield', 'https://www.vanden.travisusd.org/', true),
  ('Angelo Rodriguez High School', 'angelo-rodriguez-high-school', 'high'::public.school_level, 'Fairfield', 'https://rhs.fsusd.org/', true),
  ('Armijo High School', 'armijo-high-school', 'high'::public.school_level, 'Fairfield', 'https://ahs.fsusd.org/', true),
  ('Fairfield High School', 'fairfield-high-school', 'high'::public.school_level, 'Fairfield', 'https://fhs.fsusd.org/', true),
  ('Benicia High School', 'benicia-high-school', 'high'::public.school_level, 'Benicia', 'https://bhs.beniciaunified.org/', true),
  ('Vallejo High School', 'vallejo-high-school', 'high'::public.school_level, 'Vallejo', 'https://vhs.vallejo.k12.ca.us/', true),
  ('Jesse M. Bethel High School', 'jesse-m-bethel-high-school', 'high'::public.school_level, 'Vallejo', 'https://bhs.vallejo.k12.ca.us/', true),
  ('Dixon High School', 'dixon-high-school', 'high'::public.school_level, 'Dixon', 'https://dhs.dixonusd.org/', true),
  ('Rio Vista High School', 'rio-vista-high-school', 'high'::public.school_level, 'Rio Vista', 'https://rvhs.riverdeltausd.org/', true),
  ('Napa High School', 'napa-high-school', 'high'::public.school_level, 'Napa', 'https://nhs.nvusd.org/', true),
  ('Vintage High School', 'vintage-high-school', 'high'::public.school_level, 'Napa', 'https://vhs.nvusd.org/', true),
  ('American Canyon High School', 'american-canyon-high-school', 'high'::public.school_level, 'American Canyon', 'https://achs.nvusd.org/', true),
  ('St. Helena High School', 'st-helena-high-school', 'high'::public.school_level, 'St. Helena', 'https://www.sthelenaunified.org/', true),
  ('Calistoga Junior-Senior High School', 'calistoga-junior-senior-high-school', 'high'::public.school_level, 'Calistoga', 'https://www.calistogajshs.org/', true),
  ('New Technology High School', 'new-technology-high-school', 'high'::public.school_level, 'Napa', 'https://newtech.nvusd.org/', true),
  ('Santa Rosa High School', 'santa-rosa-high-school', 'high'::public.school_level, 'Santa Rosa', 'https://srhs.srcs.k12.ca.us/', true),
  ('Montgomery High School', 'montgomery-high-school', 'high'::public.school_level, 'Santa Rosa', 'https://mhs.srcs.k12.ca.us/', true),
  ('Piner High School', 'piner-high-school', 'high'::public.school_level, 'Santa Rosa', 'https://phs.srcs.k12.ca.us/', true),
  ('Maria Carrillo High School', 'maria-carrillo-high-school', 'high'::public.school_level, 'Santa Rosa', 'https://mchs.srcs.k12.ca.us/', true),
  ('Elsie Allen High School', 'elsie-allen-high-school', 'high'::public.school_level, 'Santa Rosa', 'https://eahs.srcs.k12.ca.us/', true),
  ('Analy High School', 'analy-high-school', 'high'::public.school_level, 'Sebastopol', 'https://analy.wscuhsd.org/', true),
  ('Healdsburg High School', 'healdsburg-high-school', 'high'::public.school_level, 'Healdsburg', 'https://hs.husd.com/', true),
  ('Petaluma High School', 'petaluma-high-school', 'high'::public.school_level, 'Petaluma', 'https://phs.petalumacityschools.org/', true),
  ('Casa Grande High School', 'casa-grande-high-school', 'high'::public.school_level, 'Petaluma', 'https://cghs.petalumacityschools.org/', true),
  ('Sonoma Valley High School', 'sonoma-valley-high-school', 'high'::public.school_level, 'Sonoma', 'https://svhs.svusd.org/', true),
  ('Windsor High School', 'windsor-high-school', 'high'::public.school_level, 'Windsor', 'https://whs.windsorusd.org/', true),
  ('Rancho Cotate High School', 'rancho-cotate-high-school', 'high'::public.school_level, 'Rohnert Park', 'https://rhs.crpusd.org/', true),
  ('Technology High School', 'technology-high-school', 'high'::public.school_level, 'Rohnert Park', 'https://ths.crpusd.org/', true),
  ('Cloverdale High School', 'cloverdale-high-school', 'high'::public.school_level, 'Cloverdale', 'https://www.cusd.org/', true),
  ('City College of San Francisco', 'city-college-of-san-francisco', 'college'::public.school_level, 'San Francisco', 'https://www.ccsf.edu/', true),
  ('Skyline College', 'skyline-college', 'college'::public.school_level, 'San Bruno', 'https://skylinecollege.edu/', true),
  ('College of San Mateo', 'college-of-san-mateo', 'college'::public.school_level, 'San Mateo', 'https://collegeofsanmateo.edu/', true),
  ('Cañada College', 'canada-college', 'college'::public.school_level, 'Redwood City', 'https://canadacollege.edu/', true),
  ('De Anza College', 'de-anza-college', 'college'::public.school_level, 'Cupertino', 'https://www.deanza.edu/', true),
  ('Foothill College', 'foothill-college', 'college'::public.school_level, 'Los Altos Hills', 'https://foothill.edu/', true),
  ('West Valley College', 'west-valley-college', 'college'::public.school_level, 'Saratoga', 'https://www.westvalley.edu/', true),
  ('Mission College', 'mission-college', 'college'::public.school_level, 'Santa Clara', 'https://missioncollege.edu/', true),
  ('San Jose City College', 'san-jose-city-college', 'college'::public.school_level, 'San Jose', 'https://sjcc.edu/', true),
  ('Evergreen Valley College', 'evergreen-valley-college', 'college'::public.school_level, 'San Jose', 'https://www.evc.edu/', true),
  ('Gavilan College', 'gavilan-college', 'college'::public.school_level, 'Gilroy', 'https://www.gavilan.edu/', true),
  ('Ohlone College', 'ohlone-college', 'college'::public.school_level, 'Fremont', 'https://www.ohlone.edu/', true),
  ('Chabot College', 'chabot-college', 'college'::public.school_level, 'Hayward', 'https://www.chabotcollege.edu/', true),
  ('Las Positas College', 'las-positas-college', 'college'::public.school_level, 'Livermore', 'https://www.laspositascollege.edu/', true),
  ('College of Alameda', 'college-of-alameda', 'college'::public.school_level, 'Alameda', 'https://alameda.peralta.edu/', true),
  ('Laney College', 'laney-college', 'college'::public.school_level, 'Oakland', 'https://laney.edu/', true),
  ('Merritt College', 'merritt-college', 'college'::public.school_level, 'Oakland', 'https://www.merritt.edu/', true),
  ('Berkeley City College', 'berkeley-city-college', 'college'::public.school_level, 'Berkeley', 'https://www.berkeleycitycollege.edu/', true),
  ('Contra Costa College', 'contra-costa-college', 'college'::public.school_level, 'San Pablo', 'https://www.contracosta.edu/', true),
  ('Diablo Valley College', 'diablo-valley-college', 'college'::public.school_level, 'Pleasant Hill', 'https://www.dvc.edu/', true),
  ('Los Medanos College', 'los-medanos-college', 'college'::public.school_level, 'Pittsburg', 'https://www.losmedanos.edu/', true),
  ('College of Marin', 'college-of-marin', 'college'::public.school_level, 'Kentfield', 'https://www.marin.edu/', true),
  ('Napa Valley College', 'napa-valley-college', 'college'::public.school_level, 'Napa', 'https://www.napavalley.edu/', true),
  ('Solano Community College', 'solano-community-college', 'college'::public.school_level, 'Fairfield', 'https://welcome.solano.edu/', true),
  ('Santa Rosa Junior College', 'santa-rosa-junior-college', 'college'::public.school_level, 'Santa Rosa', 'https://www.santarosa.edu/', true),
  ('University of California, Berkeley', 'university-of-california-berkeley', 'college'::public.school_level, 'Berkeley', 'https://www.berkeley.edu/', true),
  ('University of California, San Francisco', 'university-of-california-san-francisco', 'college'::public.school_level, 'San Francisco', 'https://www.ucsf.edu/', true),
  ('UC Law San Francisco', 'uc-law-san-francisco', 'college'::public.school_level, 'San Francisco', 'https://www.uclawsf.edu/', true),
  ('Stanford University', 'stanford-university', 'college'::public.school_level, 'Stanford', 'https://www.stanford.edu/', true),
  ('San Francisco State University', 'san-francisco-state-university', 'college'::public.school_level, 'San Francisco', 'https://www.sfsu.edu/', true),
  ('San Jose State University', 'san-jose-state-university', 'college'::public.school_level, 'San Jose', 'https://www.sjsu.edu/', true),
  ('California State University, East Bay', 'california-state-university-east-bay', 'college'::public.school_level, 'Hayward', 'https://www.csueastbay.edu/', true),
  ('Sonoma State University', 'sonoma-state-university', 'college'::public.school_level, 'Rohnert Park', 'https://www.sonoma.edu/', true),
  ('California State University Maritime Academy', 'california-state-university-maritime-academy', 'college'::public.school_level, 'Vallejo', 'https://www.csum.edu/', true),
  ('University of San Francisco', 'university-of-san-francisco', 'college'::public.school_level, 'San Francisco', 'https://www.usfca.edu/', true),
  ('Santa Clara University', 'santa-clara-university', 'college'::public.school_level, 'Santa Clara', 'https://www.scu.edu/', true),
  ('Saint Mary''s College of California', 'saint-mary-s-college-of-california', 'college'::public.school_level, 'Moraga', 'https://www.stmarys-ca.edu/', true),
  ('Mills College at Northeastern University', 'mills-college-at-northeastern-university', 'college'::public.school_level, 'Oakland', 'https://oakland.northeastern.edu/', true),
  ('Menlo College', 'menlo-college', 'college'::public.school_level, 'Atherton', 'https://www.menlo.edu/', true),
  ('Golden Gate University', 'golden-gate-university', 'college'::public.school_level, 'San Francisco', 'https://www.ggu.edu/', true),
  ('California College of the Arts', 'california-college-of-the-arts', 'college'::public.school_level, 'San Francisco', 'https://www.cca.edu/', true),
  ('Academy of Art University', 'academy-of-art-university', 'college'::public.school_level, 'San Francisco', 'https://www.academyart.edu/', true),
  ('Palo Alto University', 'palo-alto-university', 'college'::public.school_level, 'Palo Alto', 'https://www.paloaltou.edu/', true),
  ('California Institute of Integral Studies', 'california-institute-of-integral-studies', 'college'::public.school_level, 'San Francisco', 'https://www.ciis.edu/', true)
on conflict (slug) do update
set
  name = excluded.name,
  level = excluded.level,
  city = excluded.city,
  website_url = coalesce(excluded.website_url, public.schools.website_url),
  is_active = true,
  updated_at = statement_timestamp();

-- Attach the existing demo-school Google student if that account is already persisted.
insert into public.user_school_memberships (
  user_id,
  school_id,
  role,
  status,
  joined_at
)
select
  users.id,
  school.id,
  'student',
  'active',
  statement_timestamp()
from auth.users as users
join public.schools as school
  on school.slug = 'bayareaclubs-demo-high-school'
where lower(users.email) = 'bhatiamittansh@gmail.com'
on conflict (user_id, school_id, role) do update
set
  status = 'active',
  exited_at = null,
  joined_at = coalesce(public.user_school_memberships.joined_at, excluded.joined_at),
  updated_at = statement_timestamp();
