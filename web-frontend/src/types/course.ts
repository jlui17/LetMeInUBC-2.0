type Value<T> = {
  S: T;
};

export type CourseEntry = {
  name: Value<string>;
  restricted: Value<string>;
  department: Value<string>;
  description: Value<string>;
  section: Value<string>;
  number: Value<string>;
  session: Value<string>;
};
