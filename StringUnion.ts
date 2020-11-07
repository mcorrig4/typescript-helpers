/**
 * TypeScript will infer a string union type from the literal values passed to
 * this function. Without `extends string`, it would instead generalize them
 * to the common string type.
 * @see https://stackoverflow.com/questions/36836011/checking-validity-of-string-literal-union-type-at-runtime
 * 
 * @author jeremy @see https://stackoverflow.com/users/1114/jeremy
 *
 * @summary By using this to create a type, we get the added benefit of a 
 * built-in guard() and check() method that can be used to perform type guard 
 * validation.
 * @example
 *   const MyUnionTypeBasic = "Value1" | "Value2" | "Value3";
 *   export const MyUnionTypeBetter = StringUnion("Value1", "Value2", "Value3");
 *   export type MyUnionTypeBetter = typeof MyUnionTypeBetter.type;
 * @method guard Check a variable to see if it matches one of the strings in 
 * this union type
 * @example
 *   if (AnswerType.guard(str)) {
 *     validAnswer = str as AnswerType;
 *   }
 * @method check Will "cast" a string to the union type, or throw a TypeError 
 * exception if he value is not able to cast to the union type (if the guard 
 * check fails).
 * @example
 *   const str1 = "a";
 *   const str2 = "c";
 *   const AnswerType = StringUnion("a" , "b");
 *   type AnswerType = typeof AnswerType.type;
 *   const validAnswerType: AnswerType = AnswerType.check(str1);
 *   const throwTypeError: AnswerType = AnswerType.check(str2);
 * @param values all the strings you wish to use in the union type
 */
export const StringUnion = <UnionType extends string>(
  ...values: UnionType[]
) => {
  Object.freeze(values);
  const valueSet: Set<string> = new Set(values);

  const guard = (value: string): value is UnionType => {
    return valueSet.has(value);
  };

  const check = (value: string): UnionType => {
    if (!guard(value)) {
      const actual = JSON.stringify(value);
      const expected = values.map((s) => JSON.stringify(s)).join(" | ");
      throw new TypeError(
        `Value '${actual}' is not assignable to type '${expected}'.`
      );
    }
    return value;
  };

  const unionNamespace = { guard, check, values };
  return Object.freeze(
    unionNamespace as typeof unionNamespace & { type: UnionType }
  );
};

