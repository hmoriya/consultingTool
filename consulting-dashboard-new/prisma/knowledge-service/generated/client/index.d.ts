
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model KnowledgeCategory
 * 
 */
export type KnowledgeCategory = $Result.DefaultSelection<Prisma.$KnowledgeCategoryPayload>
/**
 * Model Article
 * 
 */
export type Article = $Result.DefaultSelection<Prisma.$ArticlePayload>
/**
 * Model ArticleRevision
 * 
 */
export type ArticleRevision = $Result.DefaultSelection<Prisma.$ArticleRevisionPayload>
/**
 * Model ArticleComment
 * 
 */
export type ArticleComment = $Result.DefaultSelection<Prisma.$ArticleCommentPayload>
/**
 * Model ArticleLike
 * 
 */
export type ArticleLike = $Result.DefaultSelection<Prisma.$ArticleLikePayload>
/**
 * Model ArticleView
 * 
 */
export type ArticleView = $Result.DefaultSelection<Prisma.$ArticleViewPayload>
/**
 * Model ArticleAttachment
 * 
 */
export type ArticleAttachment = $Result.DefaultSelection<Prisma.$ArticleAttachmentPayload>
/**
 * Model Template
 * 
 */
export type Template = $Result.DefaultSelection<Prisma.$TemplatePayload>
/**
 * Model FAQ
 * 
 */
export type FAQ = $Result.DefaultSelection<Prisma.$FAQPayload>
/**
 * Model FAQFeedback
 * 
 */
export type FAQFeedback = $Result.DefaultSelection<Prisma.$FAQFeedbackPayload>
/**
 * Model Expert
 * 
 */
export type Expert = $Result.DefaultSelection<Prisma.$ExpertPayload>
/**
 * Model ExpertReview
 * 
 */
export type ExpertReview = $Result.DefaultSelection<Prisma.$ExpertReviewPayload>
/**
 * Model SearchLog
 * 
 */
export type SearchLog = $Result.DefaultSelection<Prisma.$SearchLogPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const ArticleStatus: {
  DRAFT: 'DRAFT',
  REVIEW: 'REVIEW',
  APPROVED: 'APPROVED',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED'
};

export type ArticleStatus = (typeof ArticleStatus)[keyof typeof ArticleStatus]


export const ArticleVisibility: {
  PRIVATE: 'PRIVATE',
  TEAM: 'TEAM',
  ORGANIZATION: 'ORGANIZATION',
  PUBLIC: 'PUBLIC'
};

export type ArticleVisibility = (typeof ArticleVisibility)[keyof typeof ArticleVisibility]


export const DifficultyLevel: {
  BEGINNER: 'BEGINNER',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
  EXPERT: 'EXPERT'
};

export type DifficultyLevel = (typeof DifficultyLevel)[keyof typeof DifficultyLevel]


export const TemplateType: {
  DOCUMENT: 'DOCUMENT',
  EMAIL: 'EMAIL',
  PROPOSAL: 'PROPOSAL',
  REPORT: 'REPORT',
  CHECKLIST: 'CHECKLIST'
};

export type TemplateType = (typeof TemplateType)[keyof typeof TemplateType]

}

export type ArticleStatus = $Enums.ArticleStatus

export const ArticleStatus: typeof $Enums.ArticleStatus

export type ArticleVisibility = $Enums.ArticleVisibility

export const ArticleVisibility: typeof $Enums.ArticleVisibility

export type DifficultyLevel = $Enums.DifficultyLevel

export const DifficultyLevel: typeof $Enums.DifficultyLevel

export type TemplateType = $Enums.TemplateType

export const TemplateType: typeof $Enums.TemplateType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more KnowledgeCategories
 * const knowledgeCategories = await prisma.knowledgeCategory.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more KnowledgeCategories
   * const knowledgeCategories = await prisma.knowledgeCategory.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.knowledgeCategory`: Exposes CRUD operations for the **KnowledgeCategory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more KnowledgeCategories
    * const knowledgeCategories = await prisma.knowledgeCategory.findMany()
    * ```
    */
  get knowledgeCategory(): Prisma.KnowledgeCategoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.article`: Exposes CRUD operations for the **Article** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Articles
    * const articles = await prisma.article.findMany()
    * ```
    */
  get article(): Prisma.ArticleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.articleRevision`: Exposes CRUD operations for the **ArticleRevision** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ArticleRevisions
    * const articleRevisions = await prisma.articleRevision.findMany()
    * ```
    */
  get articleRevision(): Prisma.ArticleRevisionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.articleComment`: Exposes CRUD operations for the **ArticleComment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ArticleComments
    * const articleComments = await prisma.articleComment.findMany()
    * ```
    */
  get articleComment(): Prisma.ArticleCommentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.articleLike`: Exposes CRUD operations for the **ArticleLike** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ArticleLikes
    * const articleLikes = await prisma.articleLike.findMany()
    * ```
    */
  get articleLike(): Prisma.ArticleLikeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.articleView`: Exposes CRUD operations for the **ArticleView** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ArticleViews
    * const articleViews = await prisma.articleView.findMany()
    * ```
    */
  get articleView(): Prisma.ArticleViewDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.articleAttachment`: Exposes CRUD operations for the **ArticleAttachment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ArticleAttachments
    * const articleAttachments = await prisma.articleAttachment.findMany()
    * ```
    */
  get articleAttachment(): Prisma.ArticleAttachmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.template`: Exposes CRUD operations for the **Template** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Templates
    * const templates = await prisma.template.findMany()
    * ```
    */
  get template(): Prisma.TemplateDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.fAQ`: Exposes CRUD operations for the **FAQ** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FAQS
    * const fAQS = await prisma.fAQ.findMany()
    * ```
    */
  get fAQ(): Prisma.FAQDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.fAQFeedback`: Exposes CRUD operations for the **FAQFeedback** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FAQFeedbacks
    * const fAQFeedbacks = await prisma.fAQFeedback.findMany()
    * ```
    */
  get fAQFeedback(): Prisma.FAQFeedbackDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.expert`: Exposes CRUD operations for the **Expert** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Experts
    * const experts = await prisma.expert.findMany()
    * ```
    */
  get expert(): Prisma.ExpertDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.expertReview`: Exposes CRUD operations for the **ExpertReview** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ExpertReviews
    * const expertReviews = await prisma.expertReview.findMany()
    * ```
    */
  get expertReview(): Prisma.ExpertReviewDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.searchLog`: Exposes CRUD operations for the **SearchLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SearchLogs
    * const searchLogs = await prisma.searchLog.findMany()
    * ```
    */
  get searchLog(): Prisma.SearchLogDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.16.2
   * Query Engine version: 1c57fdcd7e44b29b9313256c76699e91c3ac3c43
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends bigint
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    KnowledgeCategory: 'KnowledgeCategory',
    Article: 'Article',
    ArticleRevision: 'ArticleRevision',
    ArticleComment: 'ArticleComment',
    ArticleLike: 'ArticleLike',
    ArticleView: 'ArticleView',
    ArticleAttachment: 'ArticleAttachment',
    Template: 'Template',
    FAQ: 'FAQ',
    FAQFeedback: 'FAQFeedback',
    Expert: 'Expert',
    ExpertReview: 'ExpertReview',
    SearchLog: 'SearchLog'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "knowledgeCategory" | "article" | "articleRevision" | "articleComment" | "articleLike" | "articleView" | "articleAttachment" | "template" | "fAQ" | "fAQFeedback" | "expert" | "expertReview" | "searchLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      KnowledgeCategory: {
        payload: Prisma.$KnowledgeCategoryPayload<ExtArgs>
        fields: Prisma.KnowledgeCategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.KnowledgeCategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeCategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.KnowledgeCategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeCategoryPayload>
          }
          findFirst: {
            args: Prisma.KnowledgeCategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeCategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.KnowledgeCategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeCategoryPayload>
          }
          findMany: {
            args: Prisma.KnowledgeCategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeCategoryPayload>[]
          }
          create: {
            args: Prisma.KnowledgeCategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeCategoryPayload>
          }
          createMany: {
            args: Prisma.KnowledgeCategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.KnowledgeCategoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeCategoryPayload>[]
          }
          delete: {
            args: Prisma.KnowledgeCategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeCategoryPayload>
          }
          update: {
            args: Prisma.KnowledgeCategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeCategoryPayload>
          }
          deleteMany: {
            args: Prisma.KnowledgeCategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.KnowledgeCategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.KnowledgeCategoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeCategoryPayload>[]
          }
          upsert: {
            args: Prisma.KnowledgeCategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeCategoryPayload>
          }
          aggregate: {
            args: Prisma.KnowledgeCategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateKnowledgeCategory>
          }
          groupBy: {
            args: Prisma.KnowledgeCategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<KnowledgeCategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.KnowledgeCategoryCountArgs<ExtArgs>
            result: $Utils.Optional<KnowledgeCategoryCountAggregateOutputType> | number
          }
        }
      }
      Article: {
        payload: Prisma.$ArticlePayload<ExtArgs>
        fields: Prisma.ArticleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ArticleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ArticleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          findFirst: {
            args: Prisma.ArticleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ArticleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          findMany: {
            args: Prisma.ArticleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>[]
          }
          create: {
            args: Prisma.ArticleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          createMany: {
            args: Prisma.ArticleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ArticleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>[]
          }
          delete: {
            args: Prisma.ArticleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          update: {
            args: Prisma.ArticleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          deleteMany: {
            args: Prisma.ArticleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ArticleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ArticleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>[]
          }
          upsert: {
            args: Prisma.ArticleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          aggregate: {
            args: Prisma.ArticleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateArticle>
          }
          groupBy: {
            args: Prisma.ArticleGroupByArgs<ExtArgs>
            result: $Utils.Optional<ArticleGroupByOutputType>[]
          }
          count: {
            args: Prisma.ArticleCountArgs<ExtArgs>
            result: $Utils.Optional<ArticleCountAggregateOutputType> | number
          }
        }
      }
      ArticleRevision: {
        payload: Prisma.$ArticleRevisionPayload<ExtArgs>
        fields: Prisma.ArticleRevisionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ArticleRevisionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleRevisionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ArticleRevisionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleRevisionPayload>
          }
          findFirst: {
            args: Prisma.ArticleRevisionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleRevisionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ArticleRevisionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleRevisionPayload>
          }
          findMany: {
            args: Prisma.ArticleRevisionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleRevisionPayload>[]
          }
          create: {
            args: Prisma.ArticleRevisionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleRevisionPayload>
          }
          createMany: {
            args: Prisma.ArticleRevisionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ArticleRevisionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleRevisionPayload>[]
          }
          delete: {
            args: Prisma.ArticleRevisionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleRevisionPayload>
          }
          update: {
            args: Prisma.ArticleRevisionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleRevisionPayload>
          }
          deleteMany: {
            args: Prisma.ArticleRevisionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ArticleRevisionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ArticleRevisionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleRevisionPayload>[]
          }
          upsert: {
            args: Prisma.ArticleRevisionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleRevisionPayload>
          }
          aggregate: {
            args: Prisma.ArticleRevisionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateArticleRevision>
          }
          groupBy: {
            args: Prisma.ArticleRevisionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ArticleRevisionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ArticleRevisionCountArgs<ExtArgs>
            result: $Utils.Optional<ArticleRevisionCountAggregateOutputType> | number
          }
        }
      }
      ArticleComment: {
        payload: Prisma.$ArticleCommentPayload<ExtArgs>
        fields: Prisma.ArticleCommentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ArticleCommentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleCommentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ArticleCommentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleCommentPayload>
          }
          findFirst: {
            args: Prisma.ArticleCommentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleCommentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ArticleCommentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleCommentPayload>
          }
          findMany: {
            args: Prisma.ArticleCommentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleCommentPayload>[]
          }
          create: {
            args: Prisma.ArticleCommentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleCommentPayload>
          }
          createMany: {
            args: Prisma.ArticleCommentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ArticleCommentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleCommentPayload>[]
          }
          delete: {
            args: Prisma.ArticleCommentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleCommentPayload>
          }
          update: {
            args: Prisma.ArticleCommentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleCommentPayload>
          }
          deleteMany: {
            args: Prisma.ArticleCommentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ArticleCommentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ArticleCommentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleCommentPayload>[]
          }
          upsert: {
            args: Prisma.ArticleCommentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleCommentPayload>
          }
          aggregate: {
            args: Prisma.ArticleCommentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateArticleComment>
          }
          groupBy: {
            args: Prisma.ArticleCommentGroupByArgs<ExtArgs>
            result: $Utils.Optional<ArticleCommentGroupByOutputType>[]
          }
          count: {
            args: Prisma.ArticleCommentCountArgs<ExtArgs>
            result: $Utils.Optional<ArticleCommentCountAggregateOutputType> | number
          }
        }
      }
      ArticleLike: {
        payload: Prisma.$ArticleLikePayload<ExtArgs>
        fields: Prisma.ArticleLikeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ArticleLikeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleLikePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ArticleLikeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleLikePayload>
          }
          findFirst: {
            args: Prisma.ArticleLikeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleLikePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ArticleLikeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleLikePayload>
          }
          findMany: {
            args: Prisma.ArticleLikeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleLikePayload>[]
          }
          create: {
            args: Prisma.ArticleLikeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleLikePayload>
          }
          createMany: {
            args: Prisma.ArticleLikeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ArticleLikeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleLikePayload>[]
          }
          delete: {
            args: Prisma.ArticleLikeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleLikePayload>
          }
          update: {
            args: Prisma.ArticleLikeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleLikePayload>
          }
          deleteMany: {
            args: Prisma.ArticleLikeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ArticleLikeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ArticleLikeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleLikePayload>[]
          }
          upsert: {
            args: Prisma.ArticleLikeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleLikePayload>
          }
          aggregate: {
            args: Prisma.ArticleLikeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateArticleLike>
          }
          groupBy: {
            args: Prisma.ArticleLikeGroupByArgs<ExtArgs>
            result: $Utils.Optional<ArticleLikeGroupByOutputType>[]
          }
          count: {
            args: Prisma.ArticleLikeCountArgs<ExtArgs>
            result: $Utils.Optional<ArticleLikeCountAggregateOutputType> | number
          }
        }
      }
      ArticleView: {
        payload: Prisma.$ArticleViewPayload<ExtArgs>
        fields: Prisma.ArticleViewFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ArticleViewFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleViewPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ArticleViewFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleViewPayload>
          }
          findFirst: {
            args: Prisma.ArticleViewFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleViewPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ArticleViewFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleViewPayload>
          }
          findMany: {
            args: Prisma.ArticleViewFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleViewPayload>[]
          }
          create: {
            args: Prisma.ArticleViewCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleViewPayload>
          }
          createMany: {
            args: Prisma.ArticleViewCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ArticleViewCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleViewPayload>[]
          }
          delete: {
            args: Prisma.ArticleViewDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleViewPayload>
          }
          update: {
            args: Prisma.ArticleViewUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleViewPayload>
          }
          deleteMany: {
            args: Prisma.ArticleViewDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ArticleViewUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ArticleViewUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleViewPayload>[]
          }
          upsert: {
            args: Prisma.ArticleViewUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleViewPayload>
          }
          aggregate: {
            args: Prisma.ArticleViewAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateArticleView>
          }
          groupBy: {
            args: Prisma.ArticleViewGroupByArgs<ExtArgs>
            result: $Utils.Optional<ArticleViewGroupByOutputType>[]
          }
          count: {
            args: Prisma.ArticleViewCountArgs<ExtArgs>
            result: $Utils.Optional<ArticleViewCountAggregateOutputType> | number
          }
        }
      }
      ArticleAttachment: {
        payload: Prisma.$ArticleAttachmentPayload<ExtArgs>
        fields: Prisma.ArticleAttachmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ArticleAttachmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleAttachmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ArticleAttachmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleAttachmentPayload>
          }
          findFirst: {
            args: Prisma.ArticleAttachmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleAttachmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ArticleAttachmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleAttachmentPayload>
          }
          findMany: {
            args: Prisma.ArticleAttachmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleAttachmentPayload>[]
          }
          create: {
            args: Prisma.ArticleAttachmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleAttachmentPayload>
          }
          createMany: {
            args: Prisma.ArticleAttachmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ArticleAttachmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleAttachmentPayload>[]
          }
          delete: {
            args: Prisma.ArticleAttachmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleAttachmentPayload>
          }
          update: {
            args: Prisma.ArticleAttachmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleAttachmentPayload>
          }
          deleteMany: {
            args: Prisma.ArticleAttachmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ArticleAttachmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ArticleAttachmentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleAttachmentPayload>[]
          }
          upsert: {
            args: Prisma.ArticleAttachmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleAttachmentPayload>
          }
          aggregate: {
            args: Prisma.ArticleAttachmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateArticleAttachment>
          }
          groupBy: {
            args: Prisma.ArticleAttachmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<ArticleAttachmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.ArticleAttachmentCountArgs<ExtArgs>
            result: $Utils.Optional<ArticleAttachmentCountAggregateOutputType> | number
          }
        }
      }
      Template: {
        payload: Prisma.$TemplatePayload<ExtArgs>
        fields: Prisma.TemplateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TemplateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TemplateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          findFirst: {
            args: Prisma.TemplateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TemplateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          findMany: {
            args: Prisma.TemplateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>[]
          }
          create: {
            args: Prisma.TemplateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          createMany: {
            args: Prisma.TemplateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TemplateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>[]
          }
          delete: {
            args: Prisma.TemplateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          update: {
            args: Prisma.TemplateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          deleteMany: {
            args: Prisma.TemplateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TemplateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TemplateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>[]
          }
          upsert: {
            args: Prisma.TemplateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          aggregate: {
            args: Prisma.TemplateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTemplate>
          }
          groupBy: {
            args: Prisma.TemplateGroupByArgs<ExtArgs>
            result: $Utils.Optional<TemplateGroupByOutputType>[]
          }
          count: {
            args: Prisma.TemplateCountArgs<ExtArgs>
            result: $Utils.Optional<TemplateCountAggregateOutputType> | number
          }
        }
      }
      FAQ: {
        payload: Prisma.$FAQPayload<ExtArgs>
        fields: Prisma.FAQFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FAQFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FAQPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FAQFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FAQPayload>
          }
          findFirst: {
            args: Prisma.FAQFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FAQPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FAQFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FAQPayload>
          }
          findMany: {
            args: Prisma.FAQFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FAQPayload>[]
          }
          create: {
            args: Prisma.FAQCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FAQPayload>
          }
          createMany: {
            args: Prisma.FAQCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FAQCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FAQPayload>[]
          }
          delete: {
            args: Prisma.FAQDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FAQPayload>
          }
          update: {
            args: Prisma.FAQUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FAQPayload>
          }
          deleteMany: {
            args: Prisma.FAQDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FAQUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FAQUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FAQPayload>[]
          }
          upsert: {
            args: Prisma.FAQUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FAQPayload>
          }
          aggregate: {
            args: Prisma.FAQAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFAQ>
          }
          groupBy: {
            args: Prisma.FAQGroupByArgs<ExtArgs>
            result: $Utils.Optional<FAQGroupByOutputType>[]
          }
          count: {
            args: Prisma.FAQCountArgs<ExtArgs>
            result: $Utils.Optional<FAQCountAggregateOutputType> | number
          }
        }
      }
      FAQFeedback: {
        payload: Prisma.$FAQFeedbackPayload<ExtArgs>
        fields: Prisma.FAQFeedbackFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FAQFeedbackFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FAQFeedbackPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FAQFeedbackFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FAQFeedbackPayload>
          }
          findFirst: {
            args: Prisma.FAQFeedbackFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FAQFeedbackPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FAQFeedbackFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FAQFeedbackPayload>
          }
          findMany: {
            args: Prisma.FAQFeedbackFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FAQFeedbackPayload>[]
          }
          create: {
            args: Prisma.FAQFeedbackCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FAQFeedbackPayload>
          }
          createMany: {
            args: Prisma.FAQFeedbackCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FAQFeedbackCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FAQFeedbackPayload>[]
          }
          delete: {
            args: Prisma.FAQFeedbackDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FAQFeedbackPayload>
          }
          update: {
            args: Prisma.FAQFeedbackUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FAQFeedbackPayload>
          }
          deleteMany: {
            args: Prisma.FAQFeedbackDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FAQFeedbackUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FAQFeedbackUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FAQFeedbackPayload>[]
          }
          upsert: {
            args: Prisma.FAQFeedbackUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FAQFeedbackPayload>
          }
          aggregate: {
            args: Prisma.FAQFeedbackAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFAQFeedback>
          }
          groupBy: {
            args: Prisma.FAQFeedbackGroupByArgs<ExtArgs>
            result: $Utils.Optional<FAQFeedbackGroupByOutputType>[]
          }
          count: {
            args: Prisma.FAQFeedbackCountArgs<ExtArgs>
            result: $Utils.Optional<FAQFeedbackCountAggregateOutputType> | number
          }
        }
      }
      Expert: {
        payload: Prisma.$ExpertPayload<ExtArgs>
        fields: Prisma.ExpertFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExpertFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpertPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExpertFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpertPayload>
          }
          findFirst: {
            args: Prisma.ExpertFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpertPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExpertFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpertPayload>
          }
          findMany: {
            args: Prisma.ExpertFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpertPayload>[]
          }
          create: {
            args: Prisma.ExpertCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpertPayload>
          }
          createMany: {
            args: Prisma.ExpertCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExpertCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpertPayload>[]
          }
          delete: {
            args: Prisma.ExpertDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpertPayload>
          }
          update: {
            args: Prisma.ExpertUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpertPayload>
          }
          deleteMany: {
            args: Prisma.ExpertDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExpertUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ExpertUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpertPayload>[]
          }
          upsert: {
            args: Prisma.ExpertUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpertPayload>
          }
          aggregate: {
            args: Prisma.ExpertAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExpert>
          }
          groupBy: {
            args: Prisma.ExpertGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExpertGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExpertCountArgs<ExtArgs>
            result: $Utils.Optional<ExpertCountAggregateOutputType> | number
          }
        }
      }
      ExpertReview: {
        payload: Prisma.$ExpertReviewPayload<ExtArgs>
        fields: Prisma.ExpertReviewFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExpertReviewFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpertReviewPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExpertReviewFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpertReviewPayload>
          }
          findFirst: {
            args: Prisma.ExpertReviewFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpertReviewPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExpertReviewFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpertReviewPayload>
          }
          findMany: {
            args: Prisma.ExpertReviewFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpertReviewPayload>[]
          }
          create: {
            args: Prisma.ExpertReviewCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpertReviewPayload>
          }
          createMany: {
            args: Prisma.ExpertReviewCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExpertReviewCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpertReviewPayload>[]
          }
          delete: {
            args: Prisma.ExpertReviewDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpertReviewPayload>
          }
          update: {
            args: Prisma.ExpertReviewUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpertReviewPayload>
          }
          deleteMany: {
            args: Prisma.ExpertReviewDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExpertReviewUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ExpertReviewUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpertReviewPayload>[]
          }
          upsert: {
            args: Prisma.ExpertReviewUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExpertReviewPayload>
          }
          aggregate: {
            args: Prisma.ExpertReviewAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExpertReview>
          }
          groupBy: {
            args: Prisma.ExpertReviewGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExpertReviewGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExpertReviewCountArgs<ExtArgs>
            result: $Utils.Optional<ExpertReviewCountAggregateOutputType> | number
          }
        }
      }
      SearchLog: {
        payload: Prisma.$SearchLogPayload<ExtArgs>
        fields: Prisma.SearchLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SearchLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SearchLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchLogPayload>
          }
          findFirst: {
            args: Prisma.SearchLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SearchLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchLogPayload>
          }
          findMany: {
            args: Prisma.SearchLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchLogPayload>[]
          }
          create: {
            args: Prisma.SearchLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchLogPayload>
          }
          createMany: {
            args: Prisma.SearchLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SearchLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchLogPayload>[]
          }
          delete: {
            args: Prisma.SearchLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchLogPayload>
          }
          update: {
            args: Prisma.SearchLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchLogPayload>
          }
          deleteMany: {
            args: Prisma.SearchLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SearchLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SearchLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchLogPayload>[]
          }
          upsert: {
            args: Prisma.SearchLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SearchLogPayload>
          }
          aggregate: {
            args: Prisma.SearchLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSearchLog>
          }
          groupBy: {
            args: Prisma.SearchLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<SearchLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.SearchLogCountArgs<ExtArgs>
            result: $Utils.Optional<SearchLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    knowledgeCategory?: KnowledgeCategoryOmit
    article?: ArticleOmit
    articleRevision?: ArticleRevisionOmit
    articleComment?: ArticleCommentOmit
    articleLike?: ArticleLikeOmit
    articleView?: ArticleViewOmit
    articleAttachment?: ArticleAttachmentOmit
    template?: TemplateOmit
    fAQ?: FAQOmit
    fAQFeedback?: FAQFeedbackOmit
    expert?: ExpertOmit
    expertReview?: ExpertReviewOmit
    searchLog?: SearchLogOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type KnowledgeCategoryCountOutputType
   */

  export type KnowledgeCategoryCountOutputType = {
    children: number
    articles: number
    templates: number
    faqs: number
  }

  export type KnowledgeCategoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    children?: boolean | KnowledgeCategoryCountOutputTypeCountChildrenArgs
    articles?: boolean | KnowledgeCategoryCountOutputTypeCountArticlesArgs
    templates?: boolean | KnowledgeCategoryCountOutputTypeCountTemplatesArgs
    faqs?: boolean | KnowledgeCategoryCountOutputTypeCountFaqsArgs
  }

  // Custom InputTypes
  /**
   * KnowledgeCategoryCountOutputType without action
   */
  export type KnowledgeCategoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeCategoryCountOutputType
     */
    select?: KnowledgeCategoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * KnowledgeCategoryCountOutputType without action
   */
  export type KnowledgeCategoryCountOutputTypeCountChildrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KnowledgeCategoryWhereInput
  }

  /**
   * KnowledgeCategoryCountOutputType without action
   */
  export type KnowledgeCategoryCountOutputTypeCountArticlesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleWhereInput
  }

  /**
   * KnowledgeCategoryCountOutputType without action
   */
  export type KnowledgeCategoryCountOutputTypeCountTemplatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TemplateWhereInput
  }

  /**
   * KnowledgeCategoryCountOutputType without action
   */
  export type KnowledgeCategoryCountOutputTypeCountFaqsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FAQWhereInput
  }


  /**
   * Count Type ArticleCountOutputType
   */

  export type ArticleCountOutputType = {
    comments: number
    likes: number
    views: number
    revisions: number
    attachments: number
  }

  export type ArticleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    comments?: boolean | ArticleCountOutputTypeCountCommentsArgs
    likes?: boolean | ArticleCountOutputTypeCountLikesArgs
    views?: boolean | ArticleCountOutputTypeCountViewsArgs
    revisions?: boolean | ArticleCountOutputTypeCountRevisionsArgs
    attachments?: boolean | ArticleCountOutputTypeCountAttachmentsArgs
  }

  // Custom InputTypes
  /**
   * ArticleCountOutputType without action
   */
  export type ArticleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleCountOutputType
     */
    select?: ArticleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ArticleCountOutputType without action
   */
  export type ArticleCountOutputTypeCountCommentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleCommentWhereInput
  }

  /**
   * ArticleCountOutputType without action
   */
  export type ArticleCountOutputTypeCountLikesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleLikeWhereInput
  }

  /**
   * ArticleCountOutputType without action
   */
  export type ArticleCountOutputTypeCountViewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleViewWhereInput
  }

  /**
   * ArticleCountOutputType without action
   */
  export type ArticleCountOutputTypeCountRevisionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleRevisionWhereInput
  }

  /**
   * ArticleCountOutputType without action
   */
  export type ArticleCountOutputTypeCountAttachmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleAttachmentWhereInput
  }


  /**
   * Count Type ArticleCommentCountOutputType
   */

  export type ArticleCommentCountOutputType = {
    replies: number
  }

  export type ArticleCommentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    replies?: boolean | ArticleCommentCountOutputTypeCountRepliesArgs
  }

  // Custom InputTypes
  /**
   * ArticleCommentCountOutputType without action
   */
  export type ArticleCommentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleCommentCountOutputType
     */
    select?: ArticleCommentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ArticleCommentCountOutputType without action
   */
  export type ArticleCommentCountOutputTypeCountRepliesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleCommentWhereInput
  }


  /**
   * Count Type FAQCountOutputType
   */

  export type FAQCountOutputType = {
    feedback: number
  }

  export type FAQCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    feedback?: boolean | FAQCountOutputTypeCountFeedbackArgs
  }

  // Custom InputTypes
  /**
   * FAQCountOutputType without action
   */
  export type FAQCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FAQCountOutputType
     */
    select?: FAQCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FAQCountOutputType without action
   */
  export type FAQCountOutputTypeCountFeedbackArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FAQFeedbackWhereInput
  }


  /**
   * Count Type ExpertCountOutputType
   */

  export type ExpertCountOutputType = {
    reviews: number
  }

  export type ExpertCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reviews?: boolean | ExpertCountOutputTypeCountReviewsArgs
  }

  // Custom InputTypes
  /**
   * ExpertCountOutputType without action
   */
  export type ExpertCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpertCountOutputType
     */
    select?: ExpertCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ExpertCountOutputType without action
   */
  export type ExpertCountOutputTypeCountReviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExpertReviewWhereInput
  }


  /**
   * Models
   */

  /**
   * Model KnowledgeCategory
   */

  export type AggregateKnowledgeCategory = {
    _count: KnowledgeCategoryCountAggregateOutputType | null
    _avg: KnowledgeCategoryAvgAggregateOutputType | null
    _sum: KnowledgeCategorySumAggregateOutputType | null
    _min: KnowledgeCategoryMinAggregateOutputType | null
    _max: KnowledgeCategoryMaxAggregateOutputType | null
  }

  export type KnowledgeCategoryAvgAggregateOutputType = {
    order: number | null
  }

  export type KnowledgeCategorySumAggregateOutputType = {
    order: number | null
  }

  export type KnowledgeCategoryMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    icon: string | null
    color: string | null
    order: number | null
    parentId: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type KnowledgeCategoryMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    icon: string | null
    color: string | null
    order: number | null
    parentId: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type KnowledgeCategoryCountAggregateOutputType = {
    id: number
    name: number
    description: number
    icon: number
    color: number
    order: number
    parentId: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type KnowledgeCategoryAvgAggregateInputType = {
    order?: true
  }

  export type KnowledgeCategorySumAggregateInputType = {
    order?: true
  }

  export type KnowledgeCategoryMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    icon?: true
    color?: true
    order?: true
    parentId?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type KnowledgeCategoryMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    icon?: true
    color?: true
    order?: true
    parentId?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type KnowledgeCategoryCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    icon?: true
    color?: true
    order?: true
    parentId?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type KnowledgeCategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KnowledgeCategory to aggregate.
     */
    where?: KnowledgeCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KnowledgeCategories to fetch.
     */
    orderBy?: KnowledgeCategoryOrderByWithRelationInput | KnowledgeCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: KnowledgeCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KnowledgeCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KnowledgeCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned KnowledgeCategories
    **/
    _count?: true | KnowledgeCategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: KnowledgeCategoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: KnowledgeCategorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: KnowledgeCategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: KnowledgeCategoryMaxAggregateInputType
  }

  export type GetKnowledgeCategoryAggregateType<T extends KnowledgeCategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateKnowledgeCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKnowledgeCategory[P]>
      : GetScalarType<T[P], AggregateKnowledgeCategory[P]>
  }




  export type KnowledgeCategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KnowledgeCategoryWhereInput
    orderBy?: KnowledgeCategoryOrderByWithAggregationInput | KnowledgeCategoryOrderByWithAggregationInput[]
    by: KnowledgeCategoryScalarFieldEnum[] | KnowledgeCategoryScalarFieldEnum
    having?: KnowledgeCategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: KnowledgeCategoryCountAggregateInputType | true
    _avg?: KnowledgeCategoryAvgAggregateInputType
    _sum?: KnowledgeCategorySumAggregateInputType
    _min?: KnowledgeCategoryMinAggregateInputType
    _max?: KnowledgeCategoryMaxAggregateInputType
  }

  export type KnowledgeCategoryGroupByOutputType = {
    id: string
    name: string
    description: string | null
    icon: string | null
    color: string | null
    order: number
    parentId: string | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: KnowledgeCategoryCountAggregateOutputType | null
    _avg: KnowledgeCategoryAvgAggregateOutputType | null
    _sum: KnowledgeCategorySumAggregateOutputType | null
    _min: KnowledgeCategoryMinAggregateOutputType | null
    _max: KnowledgeCategoryMaxAggregateOutputType | null
  }

  type GetKnowledgeCategoryGroupByPayload<T extends KnowledgeCategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<KnowledgeCategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof KnowledgeCategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], KnowledgeCategoryGroupByOutputType[P]>
            : GetScalarType<T[P], KnowledgeCategoryGroupByOutputType[P]>
        }
      >
    >


  export type KnowledgeCategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    icon?: boolean
    color?: boolean
    order?: boolean
    parentId?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    parent?: boolean | KnowledgeCategory$parentArgs<ExtArgs>
    children?: boolean | KnowledgeCategory$childrenArgs<ExtArgs>
    articles?: boolean | KnowledgeCategory$articlesArgs<ExtArgs>
    templates?: boolean | KnowledgeCategory$templatesArgs<ExtArgs>
    faqs?: boolean | KnowledgeCategory$faqsArgs<ExtArgs>
    _count?: boolean | KnowledgeCategoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["knowledgeCategory"]>

  export type KnowledgeCategorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    icon?: boolean
    color?: boolean
    order?: boolean
    parentId?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    parent?: boolean | KnowledgeCategory$parentArgs<ExtArgs>
  }, ExtArgs["result"]["knowledgeCategory"]>

  export type KnowledgeCategorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    icon?: boolean
    color?: boolean
    order?: boolean
    parentId?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    parent?: boolean | KnowledgeCategory$parentArgs<ExtArgs>
  }, ExtArgs["result"]["knowledgeCategory"]>

  export type KnowledgeCategorySelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    icon?: boolean
    color?: boolean
    order?: boolean
    parentId?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type KnowledgeCategoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "icon" | "color" | "order" | "parentId" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["knowledgeCategory"]>
  export type KnowledgeCategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parent?: boolean | KnowledgeCategory$parentArgs<ExtArgs>
    children?: boolean | KnowledgeCategory$childrenArgs<ExtArgs>
    articles?: boolean | KnowledgeCategory$articlesArgs<ExtArgs>
    templates?: boolean | KnowledgeCategory$templatesArgs<ExtArgs>
    faqs?: boolean | KnowledgeCategory$faqsArgs<ExtArgs>
    _count?: boolean | KnowledgeCategoryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type KnowledgeCategoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parent?: boolean | KnowledgeCategory$parentArgs<ExtArgs>
  }
  export type KnowledgeCategoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parent?: boolean | KnowledgeCategory$parentArgs<ExtArgs>
  }

  export type $KnowledgeCategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "KnowledgeCategory"
    objects: {
      parent: Prisma.$KnowledgeCategoryPayload<ExtArgs> | null
      children: Prisma.$KnowledgeCategoryPayload<ExtArgs>[]
      articles: Prisma.$ArticlePayload<ExtArgs>[]
      templates: Prisma.$TemplatePayload<ExtArgs>[]
      faqs: Prisma.$FAQPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      icon: string | null
      color: string | null
      order: number
      parentId: string | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["knowledgeCategory"]>
    composites: {}
  }

  type KnowledgeCategoryGetPayload<S extends boolean | null | undefined | KnowledgeCategoryDefaultArgs> = $Result.GetResult<Prisma.$KnowledgeCategoryPayload, S>

  type KnowledgeCategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<KnowledgeCategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: KnowledgeCategoryCountAggregateInputType | true
    }

  export interface KnowledgeCategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['KnowledgeCategory'], meta: { name: 'KnowledgeCategory' } }
    /**
     * Find zero or one KnowledgeCategory that matches the filter.
     * @param {KnowledgeCategoryFindUniqueArgs} args - Arguments to find a KnowledgeCategory
     * @example
     * // Get one KnowledgeCategory
     * const knowledgeCategory = await prisma.knowledgeCategory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends KnowledgeCategoryFindUniqueArgs>(args: SelectSubset<T, KnowledgeCategoryFindUniqueArgs<ExtArgs>>): Prisma__KnowledgeCategoryClient<$Result.GetResult<Prisma.$KnowledgeCategoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one KnowledgeCategory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {KnowledgeCategoryFindUniqueOrThrowArgs} args - Arguments to find a KnowledgeCategory
     * @example
     * // Get one KnowledgeCategory
     * const knowledgeCategory = await prisma.knowledgeCategory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends KnowledgeCategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, KnowledgeCategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__KnowledgeCategoryClient<$Result.GetResult<Prisma.$KnowledgeCategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KnowledgeCategory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeCategoryFindFirstArgs} args - Arguments to find a KnowledgeCategory
     * @example
     * // Get one KnowledgeCategory
     * const knowledgeCategory = await prisma.knowledgeCategory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends KnowledgeCategoryFindFirstArgs>(args?: SelectSubset<T, KnowledgeCategoryFindFirstArgs<ExtArgs>>): Prisma__KnowledgeCategoryClient<$Result.GetResult<Prisma.$KnowledgeCategoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KnowledgeCategory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeCategoryFindFirstOrThrowArgs} args - Arguments to find a KnowledgeCategory
     * @example
     * // Get one KnowledgeCategory
     * const knowledgeCategory = await prisma.knowledgeCategory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends KnowledgeCategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, KnowledgeCategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__KnowledgeCategoryClient<$Result.GetResult<Prisma.$KnowledgeCategoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more KnowledgeCategories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeCategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all KnowledgeCategories
     * const knowledgeCategories = await prisma.knowledgeCategory.findMany()
     * 
     * // Get first 10 KnowledgeCategories
     * const knowledgeCategories = await prisma.knowledgeCategory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const knowledgeCategoryWithIdOnly = await prisma.knowledgeCategory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends KnowledgeCategoryFindManyArgs>(args?: SelectSubset<T, KnowledgeCategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KnowledgeCategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a KnowledgeCategory.
     * @param {KnowledgeCategoryCreateArgs} args - Arguments to create a KnowledgeCategory.
     * @example
     * // Create one KnowledgeCategory
     * const KnowledgeCategory = await prisma.knowledgeCategory.create({
     *   data: {
     *     // ... data to create a KnowledgeCategory
     *   }
     * })
     * 
     */
    create<T extends KnowledgeCategoryCreateArgs>(args: SelectSubset<T, KnowledgeCategoryCreateArgs<ExtArgs>>): Prisma__KnowledgeCategoryClient<$Result.GetResult<Prisma.$KnowledgeCategoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many KnowledgeCategories.
     * @param {KnowledgeCategoryCreateManyArgs} args - Arguments to create many KnowledgeCategories.
     * @example
     * // Create many KnowledgeCategories
     * const knowledgeCategory = await prisma.knowledgeCategory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends KnowledgeCategoryCreateManyArgs>(args?: SelectSubset<T, KnowledgeCategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many KnowledgeCategories and returns the data saved in the database.
     * @param {KnowledgeCategoryCreateManyAndReturnArgs} args - Arguments to create many KnowledgeCategories.
     * @example
     * // Create many KnowledgeCategories
     * const knowledgeCategory = await prisma.knowledgeCategory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many KnowledgeCategories and only return the `id`
     * const knowledgeCategoryWithIdOnly = await prisma.knowledgeCategory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends KnowledgeCategoryCreateManyAndReturnArgs>(args?: SelectSubset<T, KnowledgeCategoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KnowledgeCategoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a KnowledgeCategory.
     * @param {KnowledgeCategoryDeleteArgs} args - Arguments to delete one KnowledgeCategory.
     * @example
     * // Delete one KnowledgeCategory
     * const KnowledgeCategory = await prisma.knowledgeCategory.delete({
     *   where: {
     *     // ... filter to delete one KnowledgeCategory
     *   }
     * })
     * 
     */
    delete<T extends KnowledgeCategoryDeleteArgs>(args: SelectSubset<T, KnowledgeCategoryDeleteArgs<ExtArgs>>): Prisma__KnowledgeCategoryClient<$Result.GetResult<Prisma.$KnowledgeCategoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one KnowledgeCategory.
     * @param {KnowledgeCategoryUpdateArgs} args - Arguments to update one KnowledgeCategory.
     * @example
     * // Update one KnowledgeCategory
     * const knowledgeCategory = await prisma.knowledgeCategory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends KnowledgeCategoryUpdateArgs>(args: SelectSubset<T, KnowledgeCategoryUpdateArgs<ExtArgs>>): Prisma__KnowledgeCategoryClient<$Result.GetResult<Prisma.$KnowledgeCategoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more KnowledgeCategories.
     * @param {KnowledgeCategoryDeleteManyArgs} args - Arguments to filter KnowledgeCategories to delete.
     * @example
     * // Delete a few KnowledgeCategories
     * const { count } = await prisma.knowledgeCategory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends KnowledgeCategoryDeleteManyArgs>(args?: SelectSubset<T, KnowledgeCategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KnowledgeCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeCategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many KnowledgeCategories
     * const knowledgeCategory = await prisma.knowledgeCategory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends KnowledgeCategoryUpdateManyArgs>(args: SelectSubset<T, KnowledgeCategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KnowledgeCategories and returns the data updated in the database.
     * @param {KnowledgeCategoryUpdateManyAndReturnArgs} args - Arguments to update many KnowledgeCategories.
     * @example
     * // Update many KnowledgeCategories
     * const knowledgeCategory = await prisma.knowledgeCategory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more KnowledgeCategories and only return the `id`
     * const knowledgeCategoryWithIdOnly = await prisma.knowledgeCategory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends KnowledgeCategoryUpdateManyAndReturnArgs>(args: SelectSubset<T, KnowledgeCategoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KnowledgeCategoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one KnowledgeCategory.
     * @param {KnowledgeCategoryUpsertArgs} args - Arguments to update or create a KnowledgeCategory.
     * @example
     * // Update or create a KnowledgeCategory
     * const knowledgeCategory = await prisma.knowledgeCategory.upsert({
     *   create: {
     *     // ... data to create a KnowledgeCategory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the KnowledgeCategory we want to update
     *   }
     * })
     */
    upsert<T extends KnowledgeCategoryUpsertArgs>(args: SelectSubset<T, KnowledgeCategoryUpsertArgs<ExtArgs>>): Prisma__KnowledgeCategoryClient<$Result.GetResult<Prisma.$KnowledgeCategoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of KnowledgeCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeCategoryCountArgs} args - Arguments to filter KnowledgeCategories to count.
     * @example
     * // Count the number of KnowledgeCategories
     * const count = await prisma.knowledgeCategory.count({
     *   where: {
     *     // ... the filter for the KnowledgeCategories we want to count
     *   }
     * })
    **/
    count<T extends KnowledgeCategoryCountArgs>(
      args?: Subset<T, KnowledgeCategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], KnowledgeCategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a KnowledgeCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeCategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends KnowledgeCategoryAggregateArgs>(args: Subset<T, KnowledgeCategoryAggregateArgs>): Prisma.PrismaPromise<GetKnowledgeCategoryAggregateType<T>>

    /**
     * Group by KnowledgeCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeCategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends KnowledgeCategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: KnowledgeCategoryGroupByArgs['orderBy'] }
        : { orderBy?: KnowledgeCategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, KnowledgeCategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKnowledgeCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the KnowledgeCategory model
   */
  readonly fields: KnowledgeCategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for KnowledgeCategory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__KnowledgeCategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    parent<T extends KnowledgeCategory$parentArgs<ExtArgs> = {}>(args?: Subset<T, KnowledgeCategory$parentArgs<ExtArgs>>): Prisma__KnowledgeCategoryClient<$Result.GetResult<Prisma.$KnowledgeCategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    children<T extends KnowledgeCategory$childrenArgs<ExtArgs> = {}>(args?: Subset<T, KnowledgeCategory$childrenArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KnowledgeCategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    articles<T extends KnowledgeCategory$articlesArgs<ExtArgs> = {}>(args?: Subset<T, KnowledgeCategory$articlesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    templates<T extends KnowledgeCategory$templatesArgs<ExtArgs> = {}>(args?: Subset<T, KnowledgeCategory$templatesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    faqs<T extends KnowledgeCategory$faqsArgs<ExtArgs> = {}>(args?: Subset<T, KnowledgeCategory$faqsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FAQPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the KnowledgeCategory model
   */
  interface KnowledgeCategoryFieldRefs {
    readonly id: FieldRef<"KnowledgeCategory", 'String'>
    readonly name: FieldRef<"KnowledgeCategory", 'String'>
    readonly description: FieldRef<"KnowledgeCategory", 'String'>
    readonly icon: FieldRef<"KnowledgeCategory", 'String'>
    readonly color: FieldRef<"KnowledgeCategory", 'String'>
    readonly order: FieldRef<"KnowledgeCategory", 'Int'>
    readonly parentId: FieldRef<"KnowledgeCategory", 'String'>
    readonly isActive: FieldRef<"KnowledgeCategory", 'Boolean'>
    readonly createdAt: FieldRef<"KnowledgeCategory", 'DateTime'>
    readonly updatedAt: FieldRef<"KnowledgeCategory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * KnowledgeCategory findUnique
   */
  export type KnowledgeCategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeCategory
     */
    select?: KnowledgeCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeCategory
     */
    omit?: KnowledgeCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeCategoryInclude<ExtArgs> | null
    /**
     * Filter, which KnowledgeCategory to fetch.
     */
    where: KnowledgeCategoryWhereUniqueInput
  }

  /**
   * KnowledgeCategory findUniqueOrThrow
   */
  export type KnowledgeCategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeCategory
     */
    select?: KnowledgeCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeCategory
     */
    omit?: KnowledgeCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeCategoryInclude<ExtArgs> | null
    /**
     * Filter, which KnowledgeCategory to fetch.
     */
    where: KnowledgeCategoryWhereUniqueInput
  }

  /**
   * KnowledgeCategory findFirst
   */
  export type KnowledgeCategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeCategory
     */
    select?: KnowledgeCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeCategory
     */
    omit?: KnowledgeCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeCategoryInclude<ExtArgs> | null
    /**
     * Filter, which KnowledgeCategory to fetch.
     */
    where?: KnowledgeCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KnowledgeCategories to fetch.
     */
    orderBy?: KnowledgeCategoryOrderByWithRelationInput | KnowledgeCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KnowledgeCategories.
     */
    cursor?: KnowledgeCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KnowledgeCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KnowledgeCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KnowledgeCategories.
     */
    distinct?: KnowledgeCategoryScalarFieldEnum | KnowledgeCategoryScalarFieldEnum[]
  }

  /**
   * KnowledgeCategory findFirstOrThrow
   */
  export type KnowledgeCategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeCategory
     */
    select?: KnowledgeCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeCategory
     */
    omit?: KnowledgeCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeCategoryInclude<ExtArgs> | null
    /**
     * Filter, which KnowledgeCategory to fetch.
     */
    where?: KnowledgeCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KnowledgeCategories to fetch.
     */
    orderBy?: KnowledgeCategoryOrderByWithRelationInput | KnowledgeCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KnowledgeCategories.
     */
    cursor?: KnowledgeCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KnowledgeCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KnowledgeCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KnowledgeCategories.
     */
    distinct?: KnowledgeCategoryScalarFieldEnum | KnowledgeCategoryScalarFieldEnum[]
  }

  /**
   * KnowledgeCategory findMany
   */
  export type KnowledgeCategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeCategory
     */
    select?: KnowledgeCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeCategory
     */
    omit?: KnowledgeCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeCategoryInclude<ExtArgs> | null
    /**
     * Filter, which KnowledgeCategories to fetch.
     */
    where?: KnowledgeCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KnowledgeCategories to fetch.
     */
    orderBy?: KnowledgeCategoryOrderByWithRelationInput | KnowledgeCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing KnowledgeCategories.
     */
    cursor?: KnowledgeCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KnowledgeCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KnowledgeCategories.
     */
    skip?: number
    distinct?: KnowledgeCategoryScalarFieldEnum | KnowledgeCategoryScalarFieldEnum[]
  }

  /**
   * KnowledgeCategory create
   */
  export type KnowledgeCategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeCategory
     */
    select?: KnowledgeCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeCategory
     */
    omit?: KnowledgeCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeCategoryInclude<ExtArgs> | null
    /**
     * The data needed to create a KnowledgeCategory.
     */
    data: XOR<KnowledgeCategoryCreateInput, KnowledgeCategoryUncheckedCreateInput>
  }

  /**
   * KnowledgeCategory createMany
   */
  export type KnowledgeCategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many KnowledgeCategories.
     */
    data: KnowledgeCategoryCreateManyInput | KnowledgeCategoryCreateManyInput[]
  }

  /**
   * KnowledgeCategory createManyAndReturn
   */
  export type KnowledgeCategoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeCategory
     */
    select?: KnowledgeCategorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeCategory
     */
    omit?: KnowledgeCategoryOmit<ExtArgs> | null
    /**
     * The data used to create many KnowledgeCategories.
     */
    data: KnowledgeCategoryCreateManyInput | KnowledgeCategoryCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeCategoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * KnowledgeCategory update
   */
  export type KnowledgeCategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeCategory
     */
    select?: KnowledgeCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeCategory
     */
    omit?: KnowledgeCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeCategoryInclude<ExtArgs> | null
    /**
     * The data needed to update a KnowledgeCategory.
     */
    data: XOR<KnowledgeCategoryUpdateInput, KnowledgeCategoryUncheckedUpdateInput>
    /**
     * Choose, which KnowledgeCategory to update.
     */
    where: KnowledgeCategoryWhereUniqueInput
  }

  /**
   * KnowledgeCategory updateMany
   */
  export type KnowledgeCategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update KnowledgeCategories.
     */
    data: XOR<KnowledgeCategoryUpdateManyMutationInput, KnowledgeCategoryUncheckedUpdateManyInput>
    /**
     * Filter which KnowledgeCategories to update
     */
    where?: KnowledgeCategoryWhereInput
    /**
     * Limit how many KnowledgeCategories to update.
     */
    limit?: number
  }

  /**
   * KnowledgeCategory updateManyAndReturn
   */
  export type KnowledgeCategoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeCategory
     */
    select?: KnowledgeCategorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeCategory
     */
    omit?: KnowledgeCategoryOmit<ExtArgs> | null
    /**
     * The data used to update KnowledgeCategories.
     */
    data: XOR<KnowledgeCategoryUpdateManyMutationInput, KnowledgeCategoryUncheckedUpdateManyInput>
    /**
     * Filter which KnowledgeCategories to update
     */
    where?: KnowledgeCategoryWhereInput
    /**
     * Limit how many KnowledgeCategories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeCategoryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * KnowledgeCategory upsert
   */
  export type KnowledgeCategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeCategory
     */
    select?: KnowledgeCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeCategory
     */
    omit?: KnowledgeCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeCategoryInclude<ExtArgs> | null
    /**
     * The filter to search for the KnowledgeCategory to update in case it exists.
     */
    where: KnowledgeCategoryWhereUniqueInput
    /**
     * In case the KnowledgeCategory found by the `where` argument doesn't exist, create a new KnowledgeCategory with this data.
     */
    create: XOR<KnowledgeCategoryCreateInput, KnowledgeCategoryUncheckedCreateInput>
    /**
     * In case the KnowledgeCategory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<KnowledgeCategoryUpdateInput, KnowledgeCategoryUncheckedUpdateInput>
  }

  /**
   * KnowledgeCategory delete
   */
  export type KnowledgeCategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeCategory
     */
    select?: KnowledgeCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeCategory
     */
    omit?: KnowledgeCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeCategoryInclude<ExtArgs> | null
    /**
     * Filter which KnowledgeCategory to delete.
     */
    where: KnowledgeCategoryWhereUniqueInput
  }

  /**
   * KnowledgeCategory deleteMany
   */
  export type KnowledgeCategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KnowledgeCategories to delete
     */
    where?: KnowledgeCategoryWhereInput
    /**
     * Limit how many KnowledgeCategories to delete.
     */
    limit?: number
  }

  /**
   * KnowledgeCategory.parent
   */
  export type KnowledgeCategory$parentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeCategory
     */
    select?: KnowledgeCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeCategory
     */
    omit?: KnowledgeCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeCategoryInclude<ExtArgs> | null
    where?: KnowledgeCategoryWhereInput
  }

  /**
   * KnowledgeCategory.children
   */
  export type KnowledgeCategory$childrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeCategory
     */
    select?: KnowledgeCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeCategory
     */
    omit?: KnowledgeCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeCategoryInclude<ExtArgs> | null
    where?: KnowledgeCategoryWhereInput
    orderBy?: KnowledgeCategoryOrderByWithRelationInput | KnowledgeCategoryOrderByWithRelationInput[]
    cursor?: KnowledgeCategoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: KnowledgeCategoryScalarFieldEnum | KnowledgeCategoryScalarFieldEnum[]
  }

  /**
   * KnowledgeCategory.articles
   */
  export type KnowledgeCategory$articlesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    where?: ArticleWhereInput
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    cursor?: ArticleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ArticleScalarFieldEnum | ArticleScalarFieldEnum[]
  }

  /**
   * KnowledgeCategory.templates
   */
  export type KnowledgeCategory$templatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    where?: TemplateWhereInput
    orderBy?: TemplateOrderByWithRelationInput | TemplateOrderByWithRelationInput[]
    cursor?: TemplateWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TemplateScalarFieldEnum | TemplateScalarFieldEnum[]
  }

  /**
   * KnowledgeCategory.faqs
   */
  export type KnowledgeCategory$faqsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FAQ
     */
    select?: FAQSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FAQ
     */
    omit?: FAQOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FAQInclude<ExtArgs> | null
    where?: FAQWhereInput
    orderBy?: FAQOrderByWithRelationInput | FAQOrderByWithRelationInput[]
    cursor?: FAQWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FAQScalarFieldEnum | FAQScalarFieldEnum[]
  }

  /**
   * KnowledgeCategory without action
   */
  export type KnowledgeCategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeCategory
     */
    select?: KnowledgeCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeCategory
     */
    omit?: KnowledgeCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KnowledgeCategoryInclude<ExtArgs> | null
  }


  /**
   * Model Article
   */

  export type AggregateArticle = {
    _count: ArticleCountAggregateOutputType | null
    _avg: ArticleAvgAggregateOutputType | null
    _sum: ArticleSumAggregateOutputType | null
    _min: ArticleMinAggregateOutputType | null
    _max: ArticleMaxAggregateOutputType | null
  }

  export type ArticleAvgAggregateOutputType = {
    estimatedReadTime: number | null
    viewCount: number | null
    likeCount: number | null
  }

  export type ArticleSumAggregateOutputType = {
    estimatedReadTime: number | null
    viewCount: number | null
    likeCount: number | null
  }

  export type ArticleMinAggregateOutputType = {
    id: string | null
    title: string | null
    content: string | null
    summary: string | null
    categoryId: string | null
    authorId: string | null
    status: $Enums.ArticleStatus | null
    visibility: $Enums.ArticleVisibility | null
    tags: string | null
    keywords: string | null
    estimatedReadTime: number | null
    difficulty: $Enums.DifficultyLevel | null
    viewCount: number | null
    likeCount: number | null
    reviewerId: string | null
    reviewedAt: Date | null
    publishedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ArticleMaxAggregateOutputType = {
    id: string | null
    title: string | null
    content: string | null
    summary: string | null
    categoryId: string | null
    authorId: string | null
    status: $Enums.ArticleStatus | null
    visibility: $Enums.ArticleVisibility | null
    tags: string | null
    keywords: string | null
    estimatedReadTime: number | null
    difficulty: $Enums.DifficultyLevel | null
    viewCount: number | null
    likeCount: number | null
    reviewerId: string | null
    reviewedAt: Date | null
    publishedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ArticleCountAggregateOutputType = {
    id: number
    title: number
    content: number
    summary: number
    categoryId: number
    authorId: number
    status: number
    visibility: number
    tags: number
    keywords: number
    estimatedReadTime: number
    difficulty: number
    viewCount: number
    likeCount: number
    reviewerId: number
    reviewedAt: number
    publishedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ArticleAvgAggregateInputType = {
    estimatedReadTime?: true
    viewCount?: true
    likeCount?: true
  }

  export type ArticleSumAggregateInputType = {
    estimatedReadTime?: true
    viewCount?: true
    likeCount?: true
  }

  export type ArticleMinAggregateInputType = {
    id?: true
    title?: true
    content?: true
    summary?: true
    categoryId?: true
    authorId?: true
    status?: true
    visibility?: true
    tags?: true
    keywords?: true
    estimatedReadTime?: true
    difficulty?: true
    viewCount?: true
    likeCount?: true
    reviewerId?: true
    reviewedAt?: true
    publishedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ArticleMaxAggregateInputType = {
    id?: true
    title?: true
    content?: true
    summary?: true
    categoryId?: true
    authorId?: true
    status?: true
    visibility?: true
    tags?: true
    keywords?: true
    estimatedReadTime?: true
    difficulty?: true
    viewCount?: true
    likeCount?: true
    reviewerId?: true
    reviewedAt?: true
    publishedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ArticleCountAggregateInputType = {
    id?: true
    title?: true
    content?: true
    summary?: true
    categoryId?: true
    authorId?: true
    status?: true
    visibility?: true
    tags?: true
    keywords?: true
    estimatedReadTime?: true
    difficulty?: true
    viewCount?: true
    likeCount?: true
    reviewerId?: true
    reviewedAt?: true
    publishedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ArticleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Article to aggregate.
     */
    where?: ArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Articles to fetch.
     */
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Articles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Articles
    **/
    _count?: true | ArticleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ArticleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ArticleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ArticleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ArticleMaxAggregateInputType
  }

  export type GetArticleAggregateType<T extends ArticleAggregateArgs> = {
        [P in keyof T & keyof AggregateArticle]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateArticle[P]>
      : GetScalarType<T[P], AggregateArticle[P]>
  }




  export type ArticleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleWhereInput
    orderBy?: ArticleOrderByWithAggregationInput | ArticleOrderByWithAggregationInput[]
    by: ArticleScalarFieldEnum[] | ArticleScalarFieldEnum
    having?: ArticleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ArticleCountAggregateInputType | true
    _avg?: ArticleAvgAggregateInputType
    _sum?: ArticleSumAggregateInputType
    _min?: ArticleMinAggregateInputType
    _max?: ArticleMaxAggregateInputType
  }

  export type ArticleGroupByOutputType = {
    id: string
    title: string
    content: string
    summary: string | null
    categoryId: string
    authorId: string
    status: $Enums.ArticleStatus
    visibility: $Enums.ArticleVisibility
    tags: string | null
    keywords: string | null
    estimatedReadTime: number | null
    difficulty: $Enums.DifficultyLevel
    viewCount: number
    likeCount: number
    reviewerId: string | null
    reviewedAt: Date | null
    publishedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: ArticleCountAggregateOutputType | null
    _avg: ArticleAvgAggregateOutputType | null
    _sum: ArticleSumAggregateOutputType | null
    _min: ArticleMinAggregateOutputType | null
    _max: ArticleMaxAggregateOutputType | null
  }

  type GetArticleGroupByPayload<T extends ArticleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ArticleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ArticleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ArticleGroupByOutputType[P]>
            : GetScalarType<T[P], ArticleGroupByOutputType[P]>
        }
      >
    >


  export type ArticleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    summary?: boolean
    categoryId?: boolean
    authorId?: boolean
    status?: boolean
    visibility?: boolean
    tags?: boolean
    keywords?: boolean
    estimatedReadTime?: boolean
    difficulty?: boolean
    viewCount?: boolean
    likeCount?: boolean
    reviewerId?: boolean
    reviewedAt?: boolean
    publishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    category?: boolean | KnowledgeCategoryDefaultArgs<ExtArgs>
    comments?: boolean | Article$commentsArgs<ExtArgs>
    likes?: boolean | Article$likesArgs<ExtArgs>
    views?: boolean | Article$viewsArgs<ExtArgs>
    revisions?: boolean | Article$revisionsArgs<ExtArgs>
    attachments?: boolean | Article$attachmentsArgs<ExtArgs>
    _count?: boolean | ArticleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["article"]>

  export type ArticleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    summary?: boolean
    categoryId?: boolean
    authorId?: boolean
    status?: boolean
    visibility?: boolean
    tags?: boolean
    keywords?: boolean
    estimatedReadTime?: boolean
    difficulty?: boolean
    viewCount?: boolean
    likeCount?: boolean
    reviewerId?: boolean
    reviewedAt?: boolean
    publishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    category?: boolean | KnowledgeCategoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["article"]>

  export type ArticleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    summary?: boolean
    categoryId?: boolean
    authorId?: boolean
    status?: boolean
    visibility?: boolean
    tags?: boolean
    keywords?: boolean
    estimatedReadTime?: boolean
    difficulty?: boolean
    viewCount?: boolean
    likeCount?: boolean
    reviewerId?: boolean
    reviewedAt?: boolean
    publishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    category?: boolean | KnowledgeCategoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["article"]>

  export type ArticleSelectScalar = {
    id?: boolean
    title?: boolean
    content?: boolean
    summary?: boolean
    categoryId?: boolean
    authorId?: boolean
    status?: boolean
    visibility?: boolean
    tags?: boolean
    keywords?: boolean
    estimatedReadTime?: boolean
    difficulty?: boolean
    viewCount?: boolean
    likeCount?: boolean
    reviewerId?: boolean
    reviewedAt?: boolean
    publishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ArticleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "content" | "summary" | "categoryId" | "authorId" | "status" | "visibility" | "tags" | "keywords" | "estimatedReadTime" | "difficulty" | "viewCount" | "likeCount" | "reviewerId" | "reviewedAt" | "publishedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["article"]>
  export type ArticleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | KnowledgeCategoryDefaultArgs<ExtArgs>
    comments?: boolean | Article$commentsArgs<ExtArgs>
    likes?: boolean | Article$likesArgs<ExtArgs>
    views?: boolean | Article$viewsArgs<ExtArgs>
    revisions?: boolean | Article$revisionsArgs<ExtArgs>
    attachments?: boolean | Article$attachmentsArgs<ExtArgs>
    _count?: boolean | ArticleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ArticleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | KnowledgeCategoryDefaultArgs<ExtArgs>
  }
  export type ArticleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | KnowledgeCategoryDefaultArgs<ExtArgs>
  }

  export type $ArticlePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Article"
    objects: {
      category: Prisma.$KnowledgeCategoryPayload<ExtArgs>
      comments: Prisma.$ArticleCommentPayload<ExtArgs>[]
      likes: Prisma.$ArticleLikePayload<ExtArgs>[]
      views: Prisma.$ArticleViewPayload<ExtArgs>[]
      revisions: Prisma.$ArticleRevisionPayload<ExtArgs>[]
      attachments: Prisma.$ArticleAttachmentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      content: string
      summary: string | null
      categoryId: string
      authorId: string
      status: $Enums.ArticleStatus
      visibility: $Enums.ArticleVisibility
      tags: string | null
      keywords: string | null
      estimatedReadTime: number | null
      difficulty: $Enums.DifficultyLevel
      viewCount: number
      likeCount: number
      reviewerId: string | null
      reviewedAt: Date | null
      publishedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["article"]>
    composites: {}
  }

  type ArticleGetPayload<S extends boolean | null | undefined | ArticleDefaultArgs> = $Result.GetResult<Prisma.$ArticlePayload, S>

  type ArticleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ArticleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ArticleCountAggregateInputType | true
    }

  export interface ArticleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Article'], meta: { name: 'Article' } }
    /**
     * Find zero or one Article that matches the filter.
     * @param {ArticleFindUniqueArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ArticleFindUniqueArgs>(args: SelectSubset<T, ArticleFindUniqueArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Article that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ArticleFindUniqueOrThrowArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ArticleFindUniqueOrThrowArgs>(args: SelectSubset<T, ArticleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Article that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleFindFirstArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ArticleFindFirstArgs>(args?: SelectSubset<T, ArticleFindFirstArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Article that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleFindFirstOrThrowArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ArticleFindFirstOrThrowArgs>(args?: SelectSubset<T, ArticleFindFirstOrThrowArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Articles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Articles
     * const articles = await prisma.article.findMany()
     * 
     * // Get first 10 Articles
     * const articles = await prisma.article.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const articleWithIdOnly = await prisma.article.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ArticleFindManyArgs>(args?: SelectSubset<T, ArticleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Article.
     * @param {ArticleCreateArgs} args - Arguments to create a Article.
     * @example
     * // Create one Article
     * const Article = await prisma.article.create({
     *   data: {
     *     // ... data to create a Article
     *   }
     * })
     * 
     */
    create<T extends ArticleCreateArgs>(args: SelectSubset<T, ArticleCreateArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Articles.
     * @param {ArticleCreateManyArgs} args - Arguments to create many Articles.
     * @example
     * // Create many Articles
     * const article = await prisma.article.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ArticleCreateManyArgs>(args?: SelectSubset<T, ArticleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Articles and returns the data saved in the database.
     * @param {ArticleCreateManyAndReturnArgs} args - Arguments to create many Articles.
     * @example
     * // Create many Articles
     * const article = await prisma.article.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Articles and only return the `id`
     * const articleWithIdOnly = await prisma.article.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ArticleCreateManyAndReturnArgs>(args?: SelectSubset<T, ArticleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Article.
     * @param {ArticleDeleteArgs} args - Arguments to delete one Article.
     * @example
     * // Delete one Article
     * const Article = await prisma.article.delete({
     *   where: {
     *     // ... filter to delete one Article
     *   }
     * })
     * 
     */
    delete<T extends ArticleDeleteArgs>(args: SelectSubset<T, ArticleDeleteArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Article.
     * @param {ArticleUpdateArgs} args - Arguments to update one Article.
     * @example
     * // Update one Article
     * const article = await prisma.article.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ArticleUpdateArgs>(args: SelectSubset<T, ArticleUpdateArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Articles.
     * @param {ArticleDeleteManyArgs} args - Arguments to filter Articles to delete.
     * @example
     * // Delete a few Articles
     * const { count } = await prisma.article.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ArticleDeleteManyArgs>(args?: SelectSubset<T, ArticleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Articles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Articles
     * const article = await prisma.article.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ArticleUpdateManyArgs>(args: SelectSubset<T, ArticleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Articles and returns the data updated in the database.
     * @param {ArticleUpdateManyAndReturnArgs} args - Arguments to update many Articles.
     * @example
     * // Update many Articles
     * const article = await prisma.article.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Articles and only return the `id`
     * const articleWithIdOnly = await prisma.article.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ArticleUpdateManyAndReturnArgs>(args: SelectSubset<T, ArticleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Article.
     * @param {ArticleUpsertArgs} args - Arguments to update or create a Article.
     * @example
     * // Update or create a Article
     * const article = await prisma.article.upsert({
     *   create: {
     *     // ... data to create a Article
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Article we want to update
     *   }
     * })
     */
    upsert<T extends ArticleUpsertArgs>(args: SelectSubset<T, ArticleUpsertArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Articles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleCountArgs} args - Arguments to filter Articles to count.
     * @example
     * // Count the number of Articles
     * const count = await prisma.article.count({
     *   where: {
     *     // ... the filter for the Articles we want to count
     *   }
     * })
    **/
    count<T extends ArticleCountArgs>(
      args?: Subset<T, ArticleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ArticleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Article.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ArticleAggregateArgs>(args: Subset<T, ArticleAggregateArgs>): Prisma.PrismaPromise<GetArticleAggregateType<T>>

    /**
     * Group by Article.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ArticleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ArticleGroupByArgs['orderBy'] }
        : { orderBy?: ArticleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ArticleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetArticleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Article model
   */
  readonly fields: ArticleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Article.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ArticleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    category<T extends KnowledgeCategoryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, KnowledgeCategoryDefaultArgs<ExtArgs>>): Prisma__KnowledgeCategoryClient<$Result.GetResult<Prisma.$KnowledgeCategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    comments<T extends Article$commentsArgs<ExtArgs> = {}>(args?: Subset<T, Article$commentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticleCommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    likes<T extends Article$likesArgs<ExtArgs> = {}>(args?: Subset<T, Article$likesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticleLikePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    views<T extends Article$viewsArgs<ExtArgs> = {}>(args?: Subset<T, Article$viewsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticleViewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    revisions<T extends Article$revisionsArgs<ExtArgs> = {}>(args?: Subset<T, Article$revisionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticleRevisionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    attachments<T extends Article$attachmentsArgs<ExtArgs> = {}>(args?: Subset<T, Article$attachmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticleAttachmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Article model
   */
  interface ArticleFieldRefs {
    readonly id: FieldRef<"Article", 'String'>
    readonly title: FieldRef<"Article", 'String'>
    readonly content: FieldRef<"Article", 'String'>
    readonly summary: FieldRef<"Article", 'String'>
    readonly categoryId: FieldRef<"Article", 'String'>
    readonly authorId: FieldRef<"Article", 'String'>
    readonly status: FieldRef<"Article", 'ArticleStatus'>
    readonly visibility: FieldRef<"Article", 'ArticleVisibility'>
    readonly tags: FieldRef<"Article", 'String'>
    readonly keywords: FieldRef<"Article", 'String'>
    readonly estimatedReadTime: FieldRef<"Article", 'Int'>
    readonly difficulty: FieldRef<"Article", 'DifficultyLevel'>
    readonly viewCount: FieldRef<"Article", 'Int'>
    readonly likeCount: FieldRef<"Article", 'Int'>
    readonly reviewerId: FieldRef<"Article", 'String'>
    readonly reviewedAt: FieldRef<"Article", 'DateTime'>
    readonly publishedAt: FieldRef<"Article", 'DateTime'>
    readonly createdAt: FieldRef<"Article", 'DateTime'>
    readonly updatedAt: FieldRef<"Article", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Article findUnique
   */
  export type ArticleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Article to fetch.
     */
    where: ArticleWhereUniqueInput
  }

  /**
   * Article findUniqueOrThrow
   */
  export type ArticleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Article to fetch.
     */
    where: ArticleWhereUniqueInput
  }

  /**
   * Article findFirst
   */
  export type ArticleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Article to fetch.
     */
    where?: ArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Articles to fetch.
     */
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Articles.
     */
    cursor?: ArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Articles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Articles.
     */
    distinct?: ArticleScalarFieldEnum | ArticleScalarFieldEnum[]
  }

  /**
   * Article findFirstOrThrow
   */
  export type ArticleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Article to fetch.
     */
    where?: ArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Articles to fetch.
     */
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Articles.
     */
    cursor?: ArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Articles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Articles.
     */
    distinct?: ArticleScalarFieldEnum | ArticleScalarFieldEnum[]
  }

  /**
   * Article findMany
   */
  export type ArticleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Articles to fetch.
     */
    where?: ArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Articles to fetch.
     */
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Articles.
     */
    cursor?: ArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Articles.
     */
    skip?: number
    distinct?: ArticleScalarFieldEnum | ArticleScalarFieldEnum[]
  }

  /**
   * Article create
   */
  export type ArticleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * The data needed to create a Article.
     */
    data: XOR<ArticleCreateInput, ArticleUncheckedCreateInput>
  }

  /**
   * Article createMany
   */
  export type ArticleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Articles.
     */
    data: ArticleCreateManyInput | ArticleCreateManyInput[]
  }

  /**
   * Article createManyAndReturn
   */
  export type ArticleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * The data used to create many Articles.
     */
    data: ArticleCreateManyInput | ArticleCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Article update
   */
  export type ArticleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * The data needed to update a Article.
     */
    data: XOR<ArticleUpdateInput, ArticleUncheckedUpdateInput>
    /**
     * Choose, which Article to update.
     */
    where: ArticleWhereUniqueInput
  }

  /**
   * Article updateMany
   */
  export type ArticleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Articles.
     */
    data: XOR<ArticleUpdateManyMutationInput, ArticleUncheckedUpdateManyInput>
    /**
     * Filter which Articles to update
     */
    where?: ArticleWhereInput
    /**
     * Limit how many Articles to update.
     */
    limit?: number
  }

  /**
   * Article updateManyAndReturn
   */
  export type ArticleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * The data used to update Articles.
     */
    data: XOR<ArticleUpdateManyMutationInput, ArticleUncheckedUpdateManyInput>
    /**
     * Filter which Articles to update
     */
    where?: ArticleWhereInput
    /**
     * Limit how many Articles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Article upsert
   */
  export type ArticleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * The filter to search for the Article to update in case it exists.
     */
    where: ArticleWhereUniqueInput
    /**
     * In case the Article found by the `where` argument doesn't exist, create a new Article with this data.
     */
    create: XOR<ArticleCreateInput, ArticleUncheckedCreateInput>
    /**
     * In case the Article was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ArticleUpdateInput, ArticleUncheckedUpdateInput>
  }

  /**
   * Article delete
   */
  export type ArticleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter which Article to delete.
     */
    where: ArticleWhereUniqueInput
  }

  /**
   * Article deleteMany
   */
  export type ArticleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Articles to delete
     */
    where?: ArticleWhereInput
    /**
     * Limit how many Articles to delete.
     */
    limit?: number
  }

  /**
   * Article.comments
   */
  export type Article$commentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleComment
     */
    select?: ArticleCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleComment
     */
    omit?: ArticleCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleCommentInclude<ExtArgs> | null
    where?: ArticleCommentWhereInput
    orderBy?: ArticleCommentOrderByWithRelationInput | ArticleCommentOrderByWithRelationInput[]
    cursor?: ArticleCommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ArticleCommentScalarFieldEnum | ArticleCommentScalarFieldEnum[]
  }

  /**
   * Article.likes
   */
  export type Article$likesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleLike
     */
    select?: ArticleLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleLike
     */
    omit?: ArticleLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleLikeInclude<ExtArgs> | null
    where?: ArticleLikeWhereInput
    orderBy?: ArticleLikeOrderByWithRelationInput | ArticleLikeOrderByWithRelationInput[]
    cursor?: ArticleLikeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ArticleLikeScalarFieldEnum | ArticleLikeScalarFieldEnum[]
  }

  /**
   * Article.views
   */
  export type Article$viewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleView
     */
    select?: ArticleViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleView
     */
    omit?: ArticleViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleViewInclude<ExtArgs> | null
    where?: ArticleViewWhereInput
    orderBy?: ArticleViewOrderByWithRelationInput | ArticleViewOrderByWithRelationInput[]
    cursor?: ArticleViewWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ArticleViewScalarFieldEnum | ArticleViewScalarFieldEnum[]
  }

  /**
   * Article.revisions
   */
  export type Article$revisionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleRevision
     */
    select?: ArticleRevisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleRevision
     */
    omit?: ArticleRevisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleRevisionInclude<ExtArgs> | null
    where?: ArticleRevisionWhereInput
    orderBy?: ArticleRevisionOrderByWithRelationInput | ArticleRevisionOrderByWithRelationInput[]
    cursor?: ArticleRevisionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ArticleRevisionScalarFieldEnum | ArticleRevisionScalarFieldEnum[]
  }

  /**
   * Article.attachments
   */
  export type Article$attachmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleAttachment
     */
    select?: ArticleAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleAttachment
     */
    omit?: ArticleAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleAttachmentInclude<ExtArgs> | null
    where?: ArticleAttachmentWhereInput
    orderBy?: ArticleAttachmentOrderByWithRelationInput | ArticleAttachmentOrderByWithRelationInput[]
    cursor?: ArticleAttachmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ArticleAttachmentScalarFieldEnum | ArticleAttachmentScalarFieldEnum[]
  }

  /**
   * Article without action
   */
  export type ArticleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
  }


  /**
   * Model ArticleRevision
   */

  export type AggregateArticleRevision = {
    _count: ArticleRevisionCountAggregateOutputType | null
    _avg: ArticleRevisionAvgAggregateOutputType | null
    _sum: ArticleRevisionSumAggregateOutputType | null
    _min: ArticleRevisionMinAggregateOutputType | null
    _max: ArticleRevisionMaxAggregateOutputType | null
  }

  export type ArticleRevisionAvgAggregateOutputType = {
    version: number | null
  }

  export type ArticleRevisionSumAggregateOutputType = {
    version: number | null
  }

  export type ArticleRevisionMinAggregateOutputType = {
    id: string | null
    articleId: string | null
    version: number | null
    title: string | null
    content: string | null
    summary: string | null
    changes: string | null
    authorId: string | null
    createdAt: Date | null
  }

  export type ArticleRevisionMaxAggregateOutputType = {
    id: string | null
    articleId: string | null
    version: number | null
    title: string | null
    content: string | null
    summary: string | null
    changes: string | null
    authorId: string | null
    createdAt: Date | null
  }

  export type ArticleRevisionCountAggregateOutputType = {
    id: number
    articleId: number
    version: number
    title: number
    content: number
    summary: number
    changes: number
    authorId: number
    createdAt: number
    _all: number
  }


  export type ArticleRevisionAvgAggregateInputType = {
    version?: true
  }

  export type ArticleRevisionSumAggregateInputType = {
    version?: true
  }

  export type ArticleRevisionMinAggregateInputType = {
    id?: true
    articleId?: true
    version?: true
    title?: true
    content?: true
    summary?: true
    changes?: true
    authorId?: true
    createdAt?: true
  }

  export type ArticleRevisionMaxAggregateInputType = {
    id?: true
    articleId?: true
    version?: true
    title?: true
    content?: true
    summary?: true
    changes?: true
    authorId?: true
    createdAt?: true
  }

  export type ArticleRevisionCountAggregateInputType = {
    id?: true
    articleId?: true
    version?: true
    title?: true
    content?: true
    summary?: true
    changes?: true
    authorId?: true
    createdAt?: true
    _all?: true
  }

  export type ArticleRevisionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ArticleRevision to aggregate.
     */
    where?: ArticleRevisionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleRevisions to fetch.
     */
    orderBy?: ArticleRevisionOrderByWithRelationInput | ArticleRevisionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ArticleRevisionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleRevisions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleRevisions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ArticleRevisions
    **/
    _count?: true | ArticleRevisionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ArticleRevisionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ArticleRevisionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ArticleRevisionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ArticleRevisionMaxAggregateInputType
  }

  export type GetArticleRevisionAggregateType<T extends ArticleRevisionAggregateArgs> = {
        [P in keyof T & keyof AggregateArticleRevision]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateArticleRevision[P]>
      : GetScalarType<T[P], AggregateArticleRevision[P]>
  }




  export type ArticleRevisionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleRevisionWhereInput
    orderBy?: ArticleRevisionOrderByWithAggregationInput | ArticleRevisionOrderByWithAggregationInput[]
    by: ArticleRevisionScalarFieldEnum[] | ArticleRevisionScalarFieldEnum
    having?: ArticleRevisionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ArticleRevisionCountAggregateInputType | true
    _avg?: ArticleRevisionAvgAggregateInputType
    _sum?: ArticleRevisionSumAggregateInputType
    _min?: ArticleRevisionMinAggregateInputType
    _max?: ArticleRevisionMaxAggregateInputType
  }

  export type ArticleRevisionGroupByOutputType = {
    id: string
    articleId: string
    version: number
    title: string
    content: string
    summary: string | null
    changes: string | null
    authorId: string
    createdAt: Date
    _count: ArticleRevisionCountAggregateOutputType | null
    _avg: ArticleRevisionAvgAggregateOutputType | null
    _sum: ArticleRevisionSumAggregateOutputType | null
    _min: ArticleRevisionMinAggregateOutputType | null
    _max: ArticleRevisionMaxAggregateOutputType | null
  }

  type GetArticleRevisionGroupByPayload<T extends ArticleRevisionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ArticleRevisionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ArticleRevisionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ArticleRevisionGroupByOutputType[P]>
            : GetScalarType<T[P], ArticleRevisionGroupByOutputType[P]>
        }
      >
    >


  export type ArticleRevisionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    articleId?: boolean
    version?: boolean
    title?: boolean
    content?: boolean
    summary?: boolean
    changes?: boolean
    authorId?: boolean
    createdAt?: boolean
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["articleRevision"]>

  export type ArticleRevisionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    articleId?: boolean
    version?: boolean
    title?: boolean
    content?: boolean
    summary?: boolean
    changes?: boolean
    authorId?: boolean
    createdAt?: boolean
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["articleRevision"]>

  export type ArticleRevisionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    articleId?: boolean
    version?: boolean
    title?: boolean
    content?: boolean
    summary?: boolean
    changes?: boolean
    authorId?: boolean
    createdAt?: boolean
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["articleRevision"]>

  export type ArticleRevisionSelectScalar = {
    id?: boolean
    articleId?: boolean
    version?: boolean
    title?: boolean
    content?: boolean
    summary?: boolean
    changes?: boolean
    authorId?: boolean
    createdAt?: boolean
  }

  export type ArticleRevisionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "articleId" | "version" | "title" | "content" | "summary" | "changes" | "authorId" | "createdAt", ExtArgs["result"]["articleRevision"]>
  export type ArticleRevisionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }
  export type ArticleRevisionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }
  export type ArticleRevisionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }

  export type $ArticleRevisionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ArticleRevision"
    objects: {
      article: Prisma.$ArticlePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      articleId: string
      version: number
      title: string
      content: string
      summary: string | null
      changes: string | null
      authorId: string
      createdAt: Date
    }, ExtArgs["result"]["articleRevision"]>
    composites: {}
  }

  type ArticleRevisionGetPayload<S extends boolean | null | undefined | ArticleRevisionDefaultArgs> = $Result.GetResult<Prisma.$ArticleRevisionPayload, S>

  type ArticleRevisionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ArticleRevisionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ArticleRevisionCountAggregateInputType | true
    }

  export interface ArticleRevisionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ArticleRevision'], meta: { name: 'ArticleRevision' } }
    /**
     * Find zero or one ArticleRevision that matches the filter.
     * @param {ArticleRevisionFindUniqueArgs} args - Arguments to find a ArticleRevision
     * @example
     * // Get one ArticleRevision
     * const articleRevision = await prisma.articleRevision.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ArticleRevisionFindUniqueArgs>(args: SelectSubset<T, ArticleRevisionFindUniqueArgs<ExtArgs>>): Prisma__ArticleRevisionClient<$Result.GetResult<Prisma.$ArticleRevisionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ArticleRevision that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ArticleRevisionFindUniqueOrThrowArgs} args - Arguments to find a ArticleRevision
     * @example
     * // Get one ArticleRevision
     * const articleRevision = await prisma.articleRevision.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ArticleRevisionFindUniqueOrThrowArgs>(args: SelectSubset<T, ArticleRevisionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ArticleRevisionClient<$Result.GetResult<Prisma.$ArticleRevisionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ArticleRevision that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleRevisionFindFirstArgs} args - Arguments to find a ArticleRevision
     * @example
     * // Get one ArticleRevision
     * const articleRevision = await prisma.articleRevision.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ArticleRevisionFindFirstArgs>(args?: SelectSubset<T, ArticleRevisionFindFirstArgs<ExtArgs>>): Prisma__ArticleRevisionClient<$Result.GetResult<Prisma.$ArticleRevisionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ArticleRevision that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleRevisionFindFirstOrThrowArgs} args - Arguments to find a ArticleRevision
     * @example
     * // Get one ArticleRevision
     * const articleRevision = await prisma.articleRevision.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ArticleRevisionFindFirstOrThrowArgs>(args?: SelectSubset<T, ArticleRevisionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ArticleRevisionClient<$Result.GetResult<Prisma.$ArticleRevisionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ArticleRevisions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleRevisionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ArticleRevisions
     * const articleRevisions = await prisma.articleRevision.findMany()
     * 
     * // Get first 10 ArticleRevisions
     * const articleRevisions = await prisma.articleRevision.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const articleRevisionWithIdOnly = await prisma.articleRevision.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ArticleRevisionFindManyArgs>(args?: SelectSubset<T, ArticleRevisionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticleRevisionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ArticleRevision.
     * @param {ArticleRevisionCreateArgs} args - Arguments to create a ArticleRevision.
     * @example
     * // Create one ArticleRevision
     * const ArticleRevision = await prisma.articleRevision.create({
     *   data: {
     *     // ... data to create a ArticleRevision
     *   }
     * })
     * 
     */
    create<T extends ArticleRevisionCreateArgs>(args: SelectSubset<T, ArticleRevisionCreateArgs<ExtArgs>>): Prisma__ArticleRevisionClient<$Result.GetResult<Prisma.$ArticleRevisionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ArticleRevisions.
     * @param {ArticleRevisionCreateManyArgs} args - Arguments to create many ArticleRevisions.
     * @example
     * // Create many ArticleRevisions
     * const articleRevision = await prisma.articleRevision.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ArticleRevisionCreateManyArgs>(args?: SelectSubset<T, ArticleRevisionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ArticleRevisions and returns the data saved in the database.
     * @param {ArticleRevisionCreateManyAndReturnArgs} args - Arguments to create many ArticleRevisions.
     * @example
     * // Create many ArticleRevisions
     * const articleRevision = await prisma.articleRevision.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ArticleRevisions and only return the `id`
     * const articleRevisionWithIdOnly = await prisma.articleRevision.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ArticleRevisionCreateManyAndReturnArgs>(args?: SelectSubset<T, ArticleRevisionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticleRevisionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ArticleRevision.
     * @param {ArticleRevisionDeleteArgs} args - Arguments to delete one ArticleRevision.
     * @example
     * // Delete one ArticleRevision
     * const ArticleRevision = await prisma.articleRevision.delete({
     *   where: {
     *     // ... filter to delete one ArticleRevision
     *   }
     * })
     * 
     */
    delete<T extends ArticleRevisionDeleteArgs>(args: SelectSubset<T, ArticleRevisionDeleteArgs<ExtArgs>>): Prisma__ArticleRevisionClient<$Result.GetResult<Prisma.$ArticleRevisionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ArticleRevision.
     * @param {ArticleRevisionUpdateArgs} args - Arguments to update one ArticleRevision.
     * @example
     * // Update one ArticleRevision
     * const articleRevision = await prisma.articleRevision.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ArticleRevisionUpdateArgs>(args: SelectSubset<T, ArticleRevisionUpdateArgs<ExtArgs>>): Prisma__ArticleRevisionClient<$Result.GetResult<Prisma.$ArticleRevisionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ArticleRevisions.
     * @param {ArticleRevisionDeleteManyArgs} args - Arguments to filter ArticleRevisions to delete.
     * @example
     * // Delete a few ArticleRevisions
     * const { count } = await prisma.articleRevision.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ArticleRevisionDeleteManyArgs>(args?: SelectSubset<T, ArticleRevisionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ArticleRevisions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleRevisionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ArticleRevisions
     * const articleRevision = await prisma.articleRevision.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ArticleRevisionUpdateManyArgs>(args: SelectSubset<T, ArticleRevisionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ArticleRevisions and returns the data updated in the database.
     * @param {ArticleRevisionUpdateManyAndReturnArgs} args - Arguments to update many ArticleRevisions.
     * @example
     * // Update many ArticleRevisions
     * const articleRevision = await prisma.articleRevision.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ArticleRevisions and only return the `id`
     * const articleRevisionWithIdOnly = await prisma.articleRevision.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ArticleRevisionUpdateManyAndReturnArgs>(args: SelectSubset<T, ArticleRevisionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticleRevisionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ArticleRevision.
     * @param {ArticleRevisionUpsertArgs} args - Arguments to update or create a ArticleRevision.
     * @example
     * // Update or create a ArticleRevision
     * const articleRevision = await prisma.articleRevision.upsert({
     *   create: {
     *     // ... data to create a ArticleRevision
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ArticleRevision we want to update
     *   }
     * })
     */
    upsert<T extends ArticleRevisionUpsertArgs>(args: SelectSubset<T, ArticleRevisionUpsertArgs<ExtArgs>>): Prisma__ArticleRevisionClient<$Result.GetResult<Prisma.$ArticleRevisionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ArticleRevisions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleRevisionCountArgs} args - Arguments to filter ArticleRevisions to count.
     * @example
     * // Count the number of ArticleRevisions
     * const count = await prisma.articleRevision.count({
     *   where: {
     *     // ... the filter for the ArticleRevisions we want to count
     *   }
     * })
    **/
    count<T extends ArticleRevisionCountArgs>(
      args?: Subset<T, ArticleRevisionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ArticleRevisionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ArticleRevision.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleRevisionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ArticleRevisionAggregateArgs>(args: Subset<T, ArticleRevisionAggregateArgs>): Prisma.PrismaPromise<GetArticleRevisionAggregateType<T>>

    /**
     * Group by ArticleRevision.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleRevisionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ArticleRevisionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ArticleRevisionGroupByArgs['orderBy'] }
        : { orderBy?: ArticleRevisionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ArticleRevisionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetArticleRevisionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ArticleRevision model
   */
  readonly fields: ArticleRevisionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ArticleRevision.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ArticleRevisionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    article<T extends ArticleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ArticleDefaultArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ArticleRevision model
   */
  interface ArticleRevisionFieldRefs {
    readonly id: FieldRef<"ArticleRevision", 'String'>
    readonly articleId: FieldRef<"ArticleRevision", 'String'>
    readonly version: FieldRef<"ArticleRevision", 'Int'>
    readonly title: FieldRef<"ArticleRevision", 'String'>
    readonly content: FieldRef<"ArticleRevision", 'String'>
    readonly summary: FieldRef<"ArticleRevision", 'String'>
    readonly changes: FieldRef<"ArticleRevision", 'String'>
    readonly authorId: FieldRef<"ArticleRevision", 'String'>
    readonly createdAt: FieldRef<"ArticleRevision", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ArticleRevision findUnique
   */
  export type ArticleRevisionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleRevision
     */
    select?: ArticleRevisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleRevision
     */
    omit?: ArticleRevisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleRevisionInclude<ExtArgs> | null
    /**
     * Filter, which ArticleRevision to fetch.
     */
    where: ArticleRevisionWhereUniqueInput
  }

  /**
   * ArticleRevision findUniqueOrThrow
   */
  export type ArticleRevisionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleRevision
     */
    select?: ArticleRevisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleRevision
     */
    omit?: ArticleRevisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleRevisionInclude<ExtArgs> | null
    /**
     * Filter, which ArticleRevision to fetch.
     */
    where: ArticleRevisionWhereUniqueInput
  }

  /**
   * ArticleRevision findFirst
   */
  export type ArticleRevisionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleRevision
     */
    select?: ArticleRevisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleRevision
     */
    omit?: ArticleRevisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleRevisionInclude<ExtArgs> | null
    /**
     * Filter, which ArticleRevision to fetch.
     */
    where?: ArticleRevisionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleRevisions to fetch.
     */
    orderBy?: ArticleRevisionOrderByWithRelationInput | ArticleRevisionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ArticleRevisions.
     */
    cursor?: ArticleRevisionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleRevisions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleRevisions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ArticleRevisions.
     */
    distinct?: ArticleRevisionScalarFieldEnum | ArticleRevisionScalarFieldEnum[]
  }

  /**
   * ArticleRevision findFirstOrThrow
   */
  export type ArticleRevisionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleRevision
     */
    select?: ArticleRevisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleRevision
     */
    omit?: ArticleRevisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleRevisionInclude<ExtArgs> | null
    /**
     * Filter, which ArticleRevision to fetch.
     */
    where?: ArticleRevisionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleRevisions to fetch.
     */
    orderBy?: ArticleRevisionOrderByWithRelationInput | ArticleRevisionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ArticleRevisions.
     */
    cursor?: ArticleRevisionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleRevisions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleRevisions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ArticleRevisions.
     */
    distinct?: ArticleRevisionScalarFieldEnum | ArticleRevisionScalarFieldEnum[]
  }

  /**
   * ArticleRevision findMany
   */
  export type ArticleRevisionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleRevision
     */
    select?: ArticleRevisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleRevision
     */
    omit?: ArticleRevisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleRevisionInclude<ExtArgs> | null
    /**
     * Filter, which ArticleRevisions to fetch.
     */
    where?: ArticleRevisionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleRevisions to fetch.
     */
    orderBy?: ArticleRevisionOrderByWithRelationInput | ArticleRevisionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ArticleRevisions.
     */
    cursor?: ArticleRevisionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleRevisions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleRevisions.
     */
    skip?: number
    distinct?: ArticleRevisionScalarFieldEnum | ArticleRevisionScalarFieldEnum[]
  }

  /**
   * ArticleRevision create
   */
  export type ArticleRevisionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleRevision
     */
    select?: ArticleRevisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleRevision
     */
    omit?: ArticleRevisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleRevisionInclude<ExtArgs> | null
    /**
     * The data needed to create a ArticleRevision.
     */
    data: XOR<ArticleRevisionCreateInput, ArticleRevisionUncheckedCreateInput>
  }

  /**
   * ArticleRevision createMany
   */
  export type ArticleRevisionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ArticleRevisions.
     */
    data: ArticleRevisionCreateManyInput | ArticleRevisionCreateManyInput[]
  }

  /**
   * ArticleRevision createManyAndReturn
   */
  export type ArticleRevisionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleRevision
     */
    select?: ArticleRevisionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleRevision
     */
    omit?: ArticleRevisionOmit<ExtArgs> | null
    /**
     * The data used to create many ArticleRevisions.
     */
    data: ArticleRevisionCreateManyInput | ArticleRevisionCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleRevisionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ArticleRevision update
   */
  export type ArticleRevisionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleRevision
     */
    select?: ArticleRevisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleRevision
     */
    omit?: ArticleRevisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleRevisionInclude<ExtArgs> | null
    /**
     * The data needed to update a ArticleRevision.
     */
    data: XOR<ArticleRevisionUpdateInput, ArticleRevisionUncheckedUpdateInput>
    /**
     * Choose, which ArticleRevision to update.
     */
    where: ArticleRevisionWhereUniqueInput
  }

  /**
   * ArticleRevision updateMany
   */
  export type ArticleRevisionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ArticleRevisions.
     */
    data: XOR<ArticleRevisionUpdateManyMutationInput, ArticleRevisionUncheckedUpdateManyInput>
    /**
     * Filter which ArticleRevisions to update
     */
    where?: ArticleRevisionWhereInput
    /**
     * Limit how many ArticleRevisions to update.
     */
    limit?: number
  }

  /**
   * ArticleRevision updateManyAndReturn
   */
  export type ArticleRevisionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleRevision
     */
    select?: ArticleRevisionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleRevision
     */
    omit?: ArticleRevisionOmit<ExtArgs> | null
    /**
     * The data used to update ArticleRevisions.
     */
    data: XOR<ArticleRevisionUpdateManyMutationInput, ArticleRevisionUncheckedUpdateManyInput>
    /**
     * Filter which ArticleRevisions to update
     */
    where?: ArticleRevisionWhereInput
    /**
     * Limit how many ArticleRevisions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleRevisionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ArticleRevision upsert
   */
  export type ArticleRevisionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleRevision
     */
    select?: ArticleRevisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleRevision
     */
    omit?: ArticleRevisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleRevisionInclude<ExtArgs> | null
    /**
     * The filter to search for the ArticleRevision to update in case it exists.
     */
    where: ArticleRevisionWhereUniqueInput
    /**
     * In case the ArticleRevision found by the `where` argument doesn't exist, create a new ArticleRevision with this data.
     */
    create: XOR<ArticleRevisionCreateInput, ArticleRevisionUncheckedCreateInput>
    /**
     * In case the ArticleRevision was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ArticleRevisionUpdateInput, ArticleRevisionUncheckedUpdateInput>
  }

  /**
   * ArticleRevision delete
   */
  export type ArticleRevisionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleRevision
     */
    select?: ArticleRevisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleRevision
     */
    omit?: ArticleRevisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleRevisionInclude<ExtArgs> | null
    /**
     * Filter which ArticleRevision to delete.
     */
    where: ArticleRevisionWhereUniqueInput
  }

  /**
   * ArticleRevision deleteMany
   */
  export type ArticleRevisionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ArticleRevisions to delete
     */
    where?: ArticleRevisionWhereInput
    /**
     * Limit how many ArticleRevisions to delete.
     */
    limit?: number
  }

  /**
   * ArticleRevision without action
   */
  export type ArticleRevisionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleRevision
     */
    select?: ArticleRevisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleRevision
     */
    omit?: ArticleRevisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleRevisionInclude<ExtArgs> | null
  }


  /**
   * Model ArticleComment
   */

  export type AggregateArticleComment = {
    _count: ArticleCommentCountAggregateOutputType | null
    _min: ArticleCommentMinAggregateOutputType | null
    _max: ArticleCommentMaxAggregateOutputType | null
  }

  export type ArticleCommentMinAggregateOutputType = {
    id: string | null
    articleId: string | null
    authorId: string | null
    content: string | null
    parentId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ArticleCommentMaxAggregateOutputType = {
    id: string | null
    articleId: string | null
    authorId: string | null
    content: string | null
    parentId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ArticleCommentCountAggregateOutputType = {
    id: number
    articleId: number
    authorId: number
    content: number
    parentId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ArticleCommentMinAggregateInputType = {
    id?: true
    articleId?: true
    authorId?: true
    content?: true
    parentId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ArticleCommentMaxAggregateInputType = {
    id?: true
    articleId?: true
    authorId?: true
    content?: true
    parentId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ArticleCommentCountAggregateInputType = {
    id?: true
    articleId?: true
    authorId?: true
    content?: true
    parentId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ArticleCommentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ArticleComment to aggregate.
     */
    where?: ArticleCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleComments to fetch.
     */
    orderBy?: ArticleCommentOrderByWithRelationInput | ArticleCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ArticleCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleComments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ArticleComments
    **/
    _count?: true | ArticleCommentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ArticleCommentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ArticleCommentMaxAggregateInputType
  }

  export type GetArticleCommentAggregateType<T extends ArticleCommentAggregateArgs> = {
        [P in keyof T & keyof AggregateArticleComment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateArticleComment[P]>
      : GetScalarType<T[P], AggregateArticleComment[P]>
  }




  export type ArticleCommentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleCommentWhereInput
    orderBy?: ArticleCommentOrderByWithAggregationInput | ArticleCommentOrderByWithAggregationInput[]
    by: ArticleCommentScalarFieldEnum[] | ArticleCommentScalarFieldEnum
    having?: ArticleCommentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ArticleCommentCountAggregateInputType | true
    _min?: ArticleCommentMinAggregateInputType
    _max?: ArticleCommentMaxAggregateInputType
  }

  export type ArticleCommentGroupByOutputType = {
    id: string
    articleId: string
    authorId: string
    content: string
    parentId: string | null
    createdAt: Date
    updatedAt: Date
    _count: ArticleCommentCountAggregateOutputType | null
    _min: ArticleCommentMinAggregateOutputType | null
    _max: ArticleCommentMaxAggregateOutputType | null
  }

  type GetArticleCommentGroupByPayload<T extends ArticleCommentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ArticleCommentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ArticleCommentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ArticleCommentGroupByOutputType[P]>
            : GetScalarType<T[P], ArticleCommentGroupByOutputType[P]>
        }
      >
    >


  export type ArticleCommentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    articleId?: boolean
    authorId?: boolean
    content?: boolean
    parentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    article?: boolean | ArticleDefaultArgs<ExtArgs>
    parent?: boolean | ArticleComment$parentArgs<ExtArgs>
    replies?: boolean | ArticleComment$repliesArgs<ExtArgs>
    _count?: boolean | ArticleCommentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["articleComment"]>

  export type ArticleCommentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    articleId?: boolean
    authorId?: boolean
    content?: boolean
    parentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    article?: boolean | ArticleDefaultArgs<ExtArgs>
    parent?: boolean | ArticleComment$parentArgs<ExtArgs>
  }, ExtArgs["result"]["articleComment"]>

  export type ArticleCommentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    articleId?: boolean
    authorId?: boolean
    content?: boolean
    parentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    article?: boolean | ArticleDefaultArgs<ExtArgs>
    parent?: boolean | ArticleComment$parentArgs<ExtArgs>
  }, ExtArgs["result"]["articleComment"]>

  export type ArticleCommentSelectScalar = {
    id?: boolean
    articleId?: boolean
    authorId?: boolean
    content?: boolean
    parentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ArticleCommentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "articleId" | "authorId" | "content" | "parentId" | "createdAt" | "updatedAt", ExtArgs["result"]["articleComment"]>
  export type ArticleCommentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    article?: boolean | ArticleDefaultArgs<ExtArgs>
    parent?: boolean | ArticleComment$parentArgs<ExtArgs>
    replies?: boolean | ArticleComment$repliesArgs<ExtArgs>
    _count?: boolean | ArticleCommentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ArticleCommentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    article?: boolean | ArticleDefaultArgs<ExtArgs>
    parent?: boolean | ArticleComment$parentArgs<ExtArgs>
  }
  export type ArticleCommentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    article?: boolean | ArticleDefaultArgs<ExtArgs>
    parent?: boolean | ArticleComment$parentArgs<ExtArgs>
  }

  export type $ArticleCommentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ArticleComment"
    objects: {
      article: Prisma.$ArticlePayload<ExtArgs>
      parent: Prisma.$ArticleCommentPayload<ExtArgs> | null
      replies: Prisma.$ArticleCommentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      articleId: string
      authorId: string
      content: string
      parentId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["articleComment"]>
    composites: {}
  }

  type ArticleCommentGetPayload<S extends boolean | null | undefined | ArticleCommentDefaultArgs> = $Result.GetResult<Prisma.$ArticleCommentPayload, S>

  type ArticleCommentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ArticleCommentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ArticleCommentCountAggregateInputType | true
    }

  export interface ArticleCommentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ArticleComment'], meta: { name: 'ArticleComment' } }
    /**
     * Find zero or one ArticleComment that matches the filter.
     * @param {ArticleCommentFindUniqueArgs} args - Arguments to find a ArticleComment
     * @example
     * // Get one ArticleComment
     * const articleComment = await prisma.articleComment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ArticleCommentFindUniqueArgs>(args: SelectSubset<T, ArticleCommentFindUniqueArgs<ExtArgs>>): Prisma__ArticleCommentClient<$Result.GetResult<Prisma.$ArticleCommentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ArticleComment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ArticleCommentFindUniqueOrThrowArgs} args - Arguments to find a ArticleComment
     * @example
     * // Get one ArticleComment
     * const articleComment = await prisma.articleComment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ArticleCommentFindUniqueOrThrowArgs>(args: SelectSubset<T, ArticleCommentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ArticleCommentClient<$Result.GetResult<Prisma.$ArticleCommentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ArticleComment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleCommentFindFirstArgs} args - Arguments to find a ArticleComment
     * @example
     * // Get one ArticleComment
     * const articleComment = await prisma.articleComment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ArticleCommentFindFirstArgs>(args?: SelectSubset<T, ArticleCommentFindFirstArgs<ExtArgs>>): Prisma__ArticleCommentClient<$Result.GetResult<Prisma.$ArticleCommentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ArticleComment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleCommentFindFirstOrThrowArgs} args - Arguments to find a ArticleComment
     * @example
     * // Get one ArticleComment
     * const articleComment = await prisma.articleComment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ArticleCommentFindFirstOrThrowArgs>(args?: SelectSubset<T, ArticleCommentFindFirstOrThrowArgs<ExtArgs>>): Prisma__ArticleCommentClient<$Result.GetResult<Prisma.$ArticleCommentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ArticleComments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleCommentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ArticleComments
     * const articleComments = await prisma.articleComment.findMany()
     * 
     * // Get first 10 ArticleComments
     * const articleComments = await prisma.articleComment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const articleCommentWithIdOnly = await prisma.articleComment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ArticleCommentFindManyArgs>(args?: SelectSubset<T, ArticleCommentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticleCommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ArticleComment.
     * @param {ArticleCommentCreateArgs} args - Arguments to create a ArticleComment.
     * @example
     * // Create one ArticleComment
     * const ArticleComment = await prisma.articleComment.create({
     *   data: {
     *     // ... data to create a ArticleComment
     *   }
     * })
     * 
     */
    create<T extends ArticleCommentCreateArgs>(args: SelectSubset<T, ArticleCommentCreateArgs<ExtArgs>>): Prisma__ArticleCommentClient<$Result.GetResult<Prisma.$ArticleCommentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ArticleComments.
     * @param {ArticleCommentCreateManyArgs} args - Arguments to create many ArticleComments.
     * @example
     * // Create many ArticleComments
     * const articleComment = await prisma.articleComment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ArticleCommentCreateManyArgs>(args?: SelectSubset<T, ArticleCommentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ArticleComments and returns the data saved in the database.
     * @param {ArticleCommentCreateManyAndReturnArgs} args - Arguments to create many ArticleComments.
     * @example
     * // Create many ArticleComments
     * const articleComment = await prisma.articleComment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ArticleComments and only return the `id`
     * const articleCommentWithIdOnly = await prisma.articleComment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ArticleCommentCreateManyAndReturnArgs>(args?: SelectSubset<T, ArticleCommentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticleCommentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ArticleComment.
     * @param {ArticleCommentDeleteArgs} args - Arguments to delete one ArticleComment.
     * @example
     * // Delete one ArticleComment
     * const ArticleComment = await prisma.articleComment.delete({
     *   where: {
     *     // ... filter to delete one ArticleComment
     *   }
     * })
     * 
     */
    delete<T extends ArticleCommentDeleteArgs>(args: SelectSubset<T, ArticleCommentDeleteArgs<ExtArgs>>): Prisma__ArticleCommentClient<$Result.GetResult<Prisma.$ArticleCommentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ArticleComment.
     * @param {ArticleCommentUpdateArgs} args - Arguments to update one ArticleComment.
     * @example
     * // Update one ArticleComment
     * const articleComment = await prisma.articleComment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ArticleCommentUpdateArgs>(args: SelectSubset<T, ArticleCommentUpdateArgs<ExtArgs>>): Prisma__ArticleCommentClient<$Result.GetResult<Prisma.$ArticleCommentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ArticleComments.
     * @param {ArticleCommentDeleteManyArgs} args - Arguments to filter ArticleComments to delete.
     * @example
     * // Delete a few ArticleComments
     * const { count } = await prisma.articleComment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ArticleCommentDeleteManyArgs>(args?: SelectSubset<T, ArticleCommentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ArticleComments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleCommentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ArticleComments
     * const articleComment = await prisma.articleComment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ArticleCommentUpdateManyArgs>(args: SelectSubset<T, ArticleCommentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ArticleComments and returns the data updated in the database.
     * @param {ArticleCommentUpdateManyAndReturnArgs} args - Arguments to update many ArticleComments.
     * @example
     * // Update many ArticleComments
     * const articleComment = await prisma.articleComment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ArticleComments and only return the `id`
     * const articleCommentWithIdOnly = await prisma.articleComment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ArticleCommentUpdateManyAndReturnArgs>(args: SelectSubset<T, ArticleCommentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticleCommentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ArticleComment.
     * @param {ArticleCommentUpsertArgs} args - Arguments to update or create a ArticleComment.
     * @example
     * // Update or create a ArticleComment
     * const articleComment = await prisma.articleComment.upsert({
     *   create: {
     *     // ... data to create a ArticleComment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ArticleComment we want to update
     *   }
     * })
     */
    upsert<T extends ArticleCommentUpsertArgs>(args: SelectSubset<T, ArticleCommentUpsertArgs<ExtArgs>>): Prisma__ArticleCommentClient<$Result.GetResult<Prisma.$ArticleCommentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ArticleComments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleCommentCountArgs} args - Arguments to filter ArticleComments to count.
     * @example
     * // Count the number of ArticleComments
     * const count = await prisma.articleComment.count({
     *   where: {
     *     // ... the filter for the ArticleComments we want to count
     *   }
     * })
    **/
    count<T extends ArticleCommentCountArgs>(
      args?: Subset<T, ArticleCommentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ArticleCommentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ArticleComment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleCommentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ArticleCommentAggregateArgs>(args: Subset<T, ArticleCommentAggregateArgs>): Prisma.PrismaPromise<GetArticleCommentAggregateType<T>>

    /**
     * Group by ArticleComment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleCommentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ArticleCommentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ArticleCommentGroupByArgs['orderBy'] }
        : { orderBy?: ArticleCommentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ArticleCommentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetArticleCommentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ArticleComment model
   */
  readonly fields: ArticleCommentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ArticleComment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ArticleCommentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    article<T extends ArticleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ArticleDefaultArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    parent<T extends ArticleComment$parentArgs<ExtArgs> = {}>(args?: Subset<T, ArticleComment$parentArgs<ExtArgs>>): Prisma__ArticleCommentClient<$Result.GetResult<Prisma.$ArticleCommentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    replies<T extends ArticleComment$repliesArgs<ExtArgs> = {}>(args?: Subset<T, ArticleComment$repliesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticleCommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ArticleComment model
   */
  interface ArticleCommentFieldRefs {
    readonly id: FieldRef<"ArticleComment", 'String'>
    readonly articleId: FieldRef<"ArticleComment", 'String'>
    readonly authorId: FieldRef<"ArticleComment", 'String'>
    readonly content: FieldRef<"ArticleComment", 'String'>
    readonly parentId: FieldRef<"ArticleComment", 'String'>
    readonly createdAt: FieldRef<"ArticleComment", 'DateTime'>
    readonly updatedAt: FieldRef<"ArticleComment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ArticleComment findUnique
   */
  export type ArticleCommentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleComment
     */
    select?: ArticleCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleComment
     */
    omit?: ArticleCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleCommentInclude<ExtArgs> | null
    /**
     * Filter, which ArticleComment to fetch.
     */
    where: ArticleCommentWhereUniqueInput
  }

  /**
   * ArticleComment findUniqueOrThrow
   */
  export type ArticleCommentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleComment
     */
    select?: ArticleCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleComment
     */
    omit?: ArticleCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleCommentInclude<ExtArgs> | null
    /**
     * Filter, which ArticleComment to fetch.
     */
    where: ArticleCommentWhereUniqueInput
  }

  /**
   * ArticleComment findFirst
   */
  export type ArticleCommentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleComment
     */
    select?: ArticleCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleComment
     */
    omit?: ArticleCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleCommentInclude<ExtArgs> | null
    /**
     * Filter, which ArticleComment to fetch.
     */
    where?: ArticleCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleComments to fetch.
     */
    orderBy?: ArticleCommentOrderByWithRelationInput | ArticleCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ArticleComments.
     */
    cursor?: ArticleCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleComments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ArticleComments.
     */
    distinct?: ArticleCommentScalarFieldEnum | ArticleCommentScalarFieldEnum[]
  }

  /**
   * ArticleComment findFirstOrThrow
   */
  export type ArticleCommentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleComment
     */
    select?: ArticleCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleComment
     */
    omit?: ArticleCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleCommentInclude<ExtArgs> | null
    /**
     * Filter, which ArticleComment to fetch.
     */
    where?: ArticleCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleComments to fetch.
     */
    orderBy?: ArticleCommentOrderByWithRelationInput | ArticleCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ArticleComments.
     */
    cursor?: ArticleCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleComments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ArticleComments.
     */
    distinct?: ArticleCommentScalarFieldEnum | ArticleCommentScalarFieldEnum[]
  }

  /**
   * ArticleComment findMany
   */
  export type ArticleCommentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleComment
     */
    select?: ArticleCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleComment
     */
    omit?: ArticleCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleCommentInclude<ExtArgs> | null
    /**
     * Filter, which ArticleComments to fetch.
     */
    where?: ArticleCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleComments to fetch.
     */
    orderBy?: ArticleCommentOrderByWithRelationInput | ArticleCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ArticleComments.
     */
    cursor?: ArticleCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleComments.
     */
    skip?: number
    distinct?: ArticleCommentScalarFieldEnum | ArticleCommentScalarFieldEnum[]
  }

  /**
   * ArticleComment create
   */
  export type ArticleCommentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleComment
     */
    select?: ArticleCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleComment
     */
    omit?: ArticleCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleCommentInclude<ExtArgs> | null
    /**
     * The data needed to create a ArticleComment.
     */
    data: XOR<ArticleCommentCreateInput, ArticleCommentUncheckedCreateInput>
  }

  /**
   * ArticleComment createMany
   */
  export type ArticleCommentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ArticleComments.
     */
    data: ArticleCommentCreateManyInput | ArticleCommentCreateManyInput[]
  }

  /**
   * ArticleComment createManyAndReturn
   */
  export type ArticleCommentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleComment
     */
    select?: ArticleCommentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleComment
     */
    omit?: ArticleCommentOmit<ExtArgs> | null
    /**
     * The data used to create many ArticleComments.
     */
    data: ArticleCommentCreateManyInput | ArticleCommentCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleCommentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ArticleComment update
   */
  export type ArticleCommentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleComment
     */
    select?: ArticleCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleComment
     */
    omit?: ArticleCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleCommentInclude<ExtArgs> | null
    /**
     * The data needed to update a ArticleComment.
     */
    data: XOR<ArticleCommentUpdateInput, ArticleCommentUncheckedUpdateInput>
    /**
     * Choose, which ArticleComment to update.
     */
    where: ArticleCommentWhereUniqueInput
  }

  /**
   * ArticleComment updateMany
   */
  export type ArticleCommentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ArticleComments.
     */
    data: XOR<ArticleCommentUpdateManyMutationInput, ArticleCommentUncheckedUpdateManyInput>
    /**
     * Filter which ArticleComments to update
     */
    where?: ArticleCommentWhereInput
    /**
     * Limit how many ArticleComments to update.
     */
    limit?: number
  }

  /**
   * ArticleComment updateManyAndReturn
   */
  export type ArticleCommentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleComment
     */
    select?: ArticleCommentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleComment
     */
    omit?: ArticleCommentOmit<ExtArgs> | null
    /**
     * The data used to update ArticleComments.
     */
    data: XOR<ArticleCommentUpdateManyMutationInput, ArticleCommentUncheckedUpdateManyInput>
    /**
     * Filter which ArticleComments to update
     */
    where?: ArticleCommentWhereInput
    /**
     * Limit how many ArticleComments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleCommentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ArticleComment upsert
   */
  export type ArticleCommentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleComment
     */
    select?: ArticleCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleComment
     */
    omit?: ArticleCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleCommentInclude<ExtArgs> | null
    /**
     * The filter to search for the ArticleComment to update in case it exists.
     */
    where: ArticleCommentWhereUniqueInput
    /**
     * In case the ArticleComment found by the `where` argument doesn't exist, create a new ArticleComment with this data.
     */
    create: XOR<ArticleCommentCreateInput, ArticleCommentUncheckedCreateInput>
    /**
     * In case the ArticleComment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ArticleCommentUpdateInput, ArticleCommentUncheckedUpdateInput>
  }

  /**
   * ArticleComment delete
   */
  export type ArticleCommentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleComment
     */
    select?: ArticleCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleComment
     */
    omit?: ArticleCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleCommentInclude<ExtArgs> | null
    /**
     * Filter which ArticleComment to delete.
     */
    where: ArticleCommentWhereUniqueInput
  }

  /**
   * ArticleComment deleteMany
   */
  export type ArticleCommentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ArticleComments to delete
     */
    where?: ArticleCommentWhereInput
    /**
     * Limit how many ArticleComments to delete.
     */
    limit?: number
  }

  /**
   * ArticleComment.parent
   */
  export type ArticleComment$parentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleComment
     */
    select?: ArticleCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleComment
     */
    omit?: ArticleCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleCommentInclude<ExtArgs> | null
    where?: ArticleCommentWhereInput
  }

  /**
   * ArticleComment.replies
   */
  export type ArticleComment$repliesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleComment
     */
    select?: ArticleCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleComment
     */
    omit?: ArticleCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleCommentInclude<ExtArgs> | null
    where?: ArticleCommentWhereInput
    orderBy?: ArticleCommentOrderByWithRelationInput | ArticleCommentOrderByWithRelationInput[]
    cursor?: ArticleCommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ArticleCommentScalarFieldEnum | ArticleCommentScalarFieldEnum[]
  }

  /**
   * ArticleComment without action
   */
  export type ArticleCommentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleComment
     */
    select?: ArticleCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleComment
     */
    omit?: ArticleCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleCommentInclude<ExtArgs> | null
  }


  /**
   * Model ArticleLike
   */

  export type AggregateArticleLike = {
    _count: ArticleLikeCountAggregateOutputType | null
    _min: ArticleLikeMinAggregateOutputType | null
    _max: ArticleLikeMaxAggregateOutputType | null
  }

  export type ArticleLikeMinAggregateOutputType = {
    id: string | null
    articleId: string | null
    userId: string | null
    createdAt: Date | null
  }

  export type ArticleLikeMaxAggregateOutputType = {
    id: string | null
    articleId: string | null
    userId: string | null
    createdAt: Date | null
  }

  export type ArticleLikeCountAggregateOutputType = {
    id: number
    articleId: number
    userId: number
    createdAt: number
    _all: number
  }


  export type ArticleLikeMinAggregateInputType = {
    id?: true
    articleId?: true
    userId?: true
    createdAt?: true
  }

  export type ArticleLikeMaxAggregateInputType = {
    id?: true
    articleId?: true
    userId?: true
    createdAt?: true
  }

  export type ArticleLikeCountAggregateInputType = {
    id?: true
    articleId?: true
    userId?: true
    createdAt?: true
    _all?: true
  }

  export type ArticleLikeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ArticleLike to aggregate.
     */
    where?: ArticleLikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleLikes to fetch.
     */
    orderBy?: ArticleLikeOrderByWithRelationInput | ArticleLikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ArticleLikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleLikes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ArticleLikes
    **/
    _count?: true | ArticleLikeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ArticleLikeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ArticleLikeMaxAggregateInputType
  }

  export type GetArticleLikeAggregateType<T extends ArticleLikeAggregateArgs> = {
        [P in keyof T & keyof AggregateArticleLike]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateArticleLike[P]>
      : GetScalarType<T[P], AggregateArticleLike[P]>
  }




  export type ArticleLikeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleLikeWhereInput
    orderBy?: ArticleLikeOrderByWithAggregationInput | ArticleLikeOrderByWithAggregationInput[]
    by: ArticleLikeScalarFieldEnum[] | ArticleLikeScalarFieldEnum
    having?: ArticleLikeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ArticleLikeCountAggregateInputType | true
    _min?: ArticleLikeMinAggregateInputType
    _max?: ArticleLikeMaxAggregateInputType
  }

  export type ArticleLikeGroupByOutputType = {
    id: string
    articleId: string
    userId: string
    createdAt: Date
    _count: ArticleLikeCountAggregateOutputType | null
    _min: ArticleLikeMinAggregateOutputType | null
    _max: ArticleLikeMaxAggregateOutputType | null
  }

  type GetArticleLikeGroupByPayload<T extends ArticleLikeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ArticleLikeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ArticleLikeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ArticleLikeGroupByOutputType[P]>
            : GetScalarType<T[P], ArticleLikeGroupByOutputType[P]>
        }
      >
    >


  export type ArticleLikeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    articleId?: boolean
    userId?: boolean
    createdAt?: boolean
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["articleLike"]>

  export type ArticleLikeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    articleId?: boolean
    userId?: boolean
    createdAt?: boolean
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["articleLike"]>

  export type ArticleLikeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    articleId?: boolean
    userId?: boolean
    createdAt?: boolean
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["articleLike"]>

  export type ArticleLikeSelectScalar = {
    id?: boolean
    articleId?: boolean
    userId?: boolean
    createdAt?: boolean
  }

  export type ArticleLikeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "articleId" | "userId" | "createdAt", ExtArgs["result"]["articleLike"]>
  export type ArticleLikeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }
  export type ArticleLikeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }
  export type ArticleLikeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }

  export type $ArticleLikePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ArticleLike"
    objects: {
      article: Prisma.$ArticlePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      articleId: string
      userId: string
      createdAt: Date
    }, ExtArgs["result"]["articleLike"]>
    composites: {}
  }

  type ArticleLikeGetPayload<S extends boolean | null | undefined | ArticleLikeDefaultArgs> = $Result.GetResult<Prisma.$ArticleLikePayload, S>

  type ArticleLikeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ArticleLikeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ArticleLikeCountAggregateInputType | true
    }

  export interface ArticleLikeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ArticleLike'], meta: { name: 'ArticleLike' } }
    /**
     * Find zero or one ArticleLike that matches the filter.
     * @param {ArticleLikeFindUniqueArgs} args - Arguments to find a ArticleLike
     * @example
     * // Get one ArticleLike
     * const articleLike = await prisma.articleLike.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ArticleLikeFindUniqueArgs>(args: SelectSubset<T, ArticleLikeFindUniqueArgs<ExtArgs>>): Prisma__ArticleLikeClient<$Result.GetResult<Prisma.$ArticleLikePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ArticleLike that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ArticleLikeFindUniqueOrThrowArgs} args - Arguments to find a ArticleLike
     * @example
     * // Get one ArticleLike
     * const articleLike = await prisma.articleLike.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ArticleLikeFindUniqueOrThrowArgs>(args: SelectSubset<T, ArticleLikeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ArticleLikeClient<$Result.GetResult<Prisma.$ArticleLikePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ArticleLike that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleLikeFindFirstArgs} args - Arguments to find a ArticleLike
     * @example
     * // Get one ArticleLike
     * const articleLike = await prisma.articleLike.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ArticleLikeFindFirstArgs>(args?: SelectSubset<T, ArticleLikeFindFirstArgs<ExtArgs>>): Prisma__ArticleLikeClient<$Result.GetResult<Prisma.$ArticleLikePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ArticleLike that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleLikeFindFirstOrThrowArgs} args - Arguments to find a ArticleLike
     * @example
     * // Get one ArticleLike
     * const articleLike = await prisma.articleLike.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ArticleLikeFindFirstOrThrowArgs>(args?: SelectSubset<T, ArticleLikeFindFirstOrThrowArgs<ExtArgs>>): Prisma__ArticleLikeClient<$Result.GetResult<Prisma.$ArticleLikePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ArticleLikes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleLikeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ArticleLikes
     * const articleLikes = await prisma.articleLike.findMany()
     * 
     * // Get first 10 ArticleLikes
     * const articleLikes = await prisma.articleLike.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const articleLikeWithIdOnly = await prisma.articleLike.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ArticleLikeFindManyArgs>(args?: SelectSubset<T, ArticleLikeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticleLikePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ArticleLike.
     * @param {ArticleLikeCreateArgs} args - Arguments to create a ArticleLike.
     * @example
     * // Create one ArticleLike
     * const ArticleLike = await prisma.articleLike.create({
     *   data: {
     *     // ... data to create a ArticleLike
     *   }
     * })
     * 
     */
    create<T extends ArticleLikeCreateArgs>(args: SelectSubset<T, ArticleLikeCreateArgs<ExtArgs>>): Prisma__ArticleLikeClient<$Result.GetResult<Prisma.$ArticleLikePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ArticleLikes.
     * @param {ArticleLikeCreateManyArgs} args - Arguments to create many ArticleLikes.
     * @example
     * // Create many ArticleLikes
     * const articleLike = await prisma.articleLike.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ArticleLikeCreateManyArgs>(args?: SelectSubset<T, ArticleLikeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ArticleLikes and returns the data saved in the database.
     * @param {ArticleLikeCreateManyAndReturnArgs} args - Arguments to create many ArticleLikes.
     * @example
     * // Create many ArticleLikes
     * const articleLike = await prisma.articleLike.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ArticleLikes and only return the `id`
     * const articleLikeWithIdOnly = await prisma.articleLike.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ArticleLikeCreateManyAndReturnArgs>(args?: SelectSubset<T, ArticleLikeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticleLikePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ArticleLike.
     * @param {ArticleLikeDeleteArgs} args - Arguments to delete one ArticleLike.
     * @example
     * // Delete one ArticleLike
     * const ArticleLike = await prisma.articleLike.delete({
     *   where: {
     *     // ... filter to delete one ArticleLike
     *   }
     * })
     * 
     */
    delete<T extends ArticleLikeDeleteArgs>(args: SelectSubset<T, ArticleLikeDeleteArgs<ExtArgs>>): Prisma__ArticleLikeClient<$Result.GetResult<Prisma.$ArticleLikePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ArticleLike.
     * @param {ArticleLikeUpdateArgs} args - Arguments to update one ArticleLike.
     * @example
     * // Update one ArticleLike
     * const articleLike = await prisma.articleLike.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ArticleLikeUpdateArgs>(args: SelectSubset<T, ArticleLikeUpdateArgs<ExtArgs>>): Prisma__ArticleLikeClient<$Result.GetResult<Prisma.$ArticleLikePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ArticleLikes.
     * @param {ArticleLikeDeleteManyArgs} args - Arguments to filter ArticleLikes to delete.
     * @example
     * // Delete a few ArticleLikes
     * const { count } = await prisma.articleLike.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ArticleLikeDeleteManyArgs>(args?: SelectSubset<T, ArticleLikeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ArticleLikes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleLikeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ArticleLikes
     * const articleLike = await prisma.articleLike.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ArticleLikeUpdateManyArgs>(args: SelectSubset<T, ArticleLikeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ArticleLikes and returns the data updated in the database.
     * @param {ArticleLikeUpdateManyAndReturnArgs} args - Arguments to update many ArticleLikes.
     * @example
     * // Update many ArticleLikes
     * const articleLike = await prisma.articleLike.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ArticleLikes and only return the `id`
     * const articleLikeWithIdOnly = await prisma.articleLike.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ArticleLikeUpdateManyAndReturnArgs>(args: SelectSubset<T, ArticleLikeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticleLikePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ArticleLike.
     * @param {ArticleLikeUpsertArgs} args - Arguments to update or create a ArticleLike.
     * @example
     * // Update or create a ArticleLike
     * const articleLike = await prisma.articleLike.upsert({
     *   create: {
     *     // ... data to create a ArticleLike
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ArticleLike we want to update
     *   }
     * })
     */
    upsert<T extends ArticleLikeUpsertArgs>(args: SelectSubset<T, ArticleLikeUpsertArgs<ExtArgs>>): Prisma__ArticleLikeClient<$Result.GetResult<Prisma.$ArticleLikePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ArticleLikes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleLikeCountArgs} args - Arguments to filter ArticleLikes to count.
     * @example
     * // Count the number of ArticleLikes
     * const count = await prisma.articleLike.count({
     *   where: {
     *     // ... the filter for the ArticleLikes we want to count
     *   }
     * })
    **/
    count<T extends ArticleLikeCountArgs>(
      args?: Subset<T, ArticleLikeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ArticleLikeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ArticleLike.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleLikeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ArticleLikeAggregateArgs>(args: Subset<T, ArticleLikeAggregateArgs>): Prisma.PrismaPromise<GetArticleLikeAggregateType<T>>

    /**
     * Group by ArticleLike.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleLikeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ArticleLikeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ArticleLikeGroupByArgs['orderBy'] }
        : { orderBy?: ArticleLikeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ArticleLikeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetArticleLikeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ArticleLike model
   */
  readonly fields: ArticleLikeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ArticleLike.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ArticleLikeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    article<T extends ArticleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ArticleDefaultArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ArticleLike model
   */
  interface ArticleLikeFieldRefs {
    readonly id: FieldRef<"ArticleLike", 'String'>
    readonly articleId: FieldRef<"ArticleLike", 'String'>
    readonly userId: FieldRef<"ArticleLike", 'String'>
    readonly createdAt: FieldRef<"ArticleLike", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ArticleLike findUnique
   */
  export type ArticleLikeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleLike
     */
    select?: ArticleLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleLike
     */
    omit?: ArticleLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleLikeInclude<ExtArgs> | null
    /**
     * Filter, which ArticleLike to fetch.
     */
    where: ArticleLikeWhereUniqueInput
  }

  /**
   * ArticleLike findUniqueOrThrow
   */
  export type ArticleLikeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleLike
     */
    select?: ArticleLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleLike
     */
    omit?: ArticleLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleLikeInclude<ExtArgs> | null
    /**
     * Filter, which ArticleLike to fetch.
     */
    where: ArticleLikeWhereUniqueInput
  }

  /**
   * ArticleLike findFirst
   */
  export type ArticleLikeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleLike
     */
    select?: ArticleLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleLike
     */
    omit?: ArticleLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleLikeInclude<ExtArgs> | null
    /**
     * Filter, which ArticleLike to fetch.
     */
    where?: ArticleLikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleLikes to fetch.
     */
    orderBy?: ArticleLikeOrderByWithRelationInput | ArticleLikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ArticleLikes.
     */
    cursor?: ArticleLikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleLikes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ArticleLikes.
     */
    distinct?: ArticleLikeScalarFieldEnum | ArticleLikeScalarFieldEnum[]
  }

  /**
   * ArticleLike findFirstOrThrow
   */
  export type ArticleLikeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleLike
     */
    select?: ArticleLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleLike
     */
    omit?: ArticleLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleLikeInclude<ExtArgs> | null
    /**
     * Filter, which ArticleLike to fetch.
     */
    where?: ArticleLikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleLikes to fetch.
     */
    orderBy?: ArticleLikeOrderByWithRelationInput | ArticleLikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ArticleLikes.
     */
    cursor?: ArticleLikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleLikes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ArticleLikes.
     */
    distinct?: ArticleLikeScalarFieldEnum | ArticleLikeScalarFieldEnum[]
  }

  /**
   * ArticleLike findMany
   */
  export type ArticleLikeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleLike
     */
    select?: ArticleLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleLike
     */
    omit?: ArticleLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleLikeInclude<ExtArgs> | null
    /**
     * Filter, which ArticleLikes to fetch.
     */
    where?: ArticleLikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleLikes to fetch.
     */
    orderBy?: ArticleLikeOrderByWithRelationInput | ArticleLikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ArticleLikes.
     */
    cursor?: ArticleLikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleLikes.
     */
    skip?: number
    distinct?: ArticleLikeScalarFieldEnum | ArticleLikeScalarFieldEnum[]
  }

  /**
   * ArticleLike create
   */
  export type ArticleLikeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleLike
     */
    select?: ArticleLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleLike
     */
    omit?: ArticleLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleLikeInclude<ExtArgs> | null
    /**
     * The data needed to create a ArticleLike.
     */
    data: XOR<ArticleLikeCreateInput, ArticleLikeUncheckedCreateInput>
  }

  /**
   * ArticleLike createMany
   */
  export type ArticleLikeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ArticleLikes.
     */
    data: ArticleLikeCreateManyInput | ArticleLikeCreateManyInput[]
  }

  /**
   * ArticleLike createManyAndReturn
   */
  export type ArticleLikeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleLike
     */
    select?: ArticleLikeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleLike
     */
    omit?: ArticleLikeOmit<ExtArgs> | null
    /**
     * The data used to create many ArticleLikes.
     */
    data: ArticleLikeCreateManyInput | ArticleLikeCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleLikeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ArticleLike update
   */
  export type ArticleLikeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleLike
     */
    select?: ArticleLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleLike
     */
    omit?: ArticleLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleLikeInclude<ExtArgs> | null
    /**
     * The data needed to update a ArticleLike.
     */
    data: XOR<ArticleLikeUpdateInput, ArticleLikeUncheckedUpdateInput>
    /**
     * Choose, which ArticleLike to update.
     */
    where: ArticleLikeWhereUniqueInput
  }

  /**
   * ArticleLike updateMany
   */
  export type ArticleLikeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ArticleLikes.
     */
    data: XOR<ArticleLikeUpdateManyMutationInput, ArticleLikeUncheckedUpdateManyInput>
    /**
     * Filter which ArticleLikes to update
     */
    where?: ArticleLikeWhereInput
    /**
     * Limit how many ArticleLikes to update.
     */
    limit?: number
  }

  /**
   * ArticleLike updateManyAndReturn
   */
  export type ArticleLikeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleLike
     */
    select?: ArticleLikeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleLike
     */
    omit?: ArticleLikeOmit<ExtArgs> | null
    /**
     * The data used to update ArticleLikes.
     */
    data: XOR<ArticleLikeUpdateManyMutationInput, ArticleLikeUncheckedUpdateManyInput>
    /**
     * Filter which ArticleLikes to update
     */
    where?: ArticleLikeWhereInput
    /**
     * Limit how many ArticleLikes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleLikeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ArticleLike upsert
   */
  export type ArticleLikeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleLike
     */
    select?: ArticleLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleLike
     */
    omit?: ArticleLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleLikeInclude<ExtArgs> | null
    /**
     * The filter to search for the ArticleLike to update in case it exists.
     */
    where: ArticleLikeWhereUniqueInput
    /**
     * In case the ArticleLike found by the `where` argument doesn't exist, create a new ArticleLike with this data.
     */
    create: XOR<ArticleLikeCreateInput, ArticleLikeUncheckedCreateInput>
    /**
     * In case the ArticleLike was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ArticleLikeUpdateInput, ArticleLikeUncheckedUpdateInput>
  }

  /**
   * ArticleLike delete
   */
  export type ArticleLikeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleLike
     */
    select?: ArticleLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleLike
     */
    omit?: ArticleLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleLikeInclude<ExtArgs> | null
    /**
     * Filter which ArticleLike to delete.
     */
    where: ArticleLikeWhereUniqueInput
  }

  /**
   * ArticleLike deleteMany
   */
  export type ArticleLikeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ArticleLikes to delete
     */
    where?: ArticleLikeWhereInput
    /**
     * Limit how many ArticleLikes to delete.
     */
    limit?: number
  }

  /**
   * ArticleLike without action
   */
  export type ArticleLikeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleLike
     */
    select?: ArticleLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleLike
     */
    omit?: ArticleLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleLikeInclude<ExtArgs> | null
  }


  /**
   * Model ArticleView
   */

  export type AggregateArticleView = {
    _count: ArticleViewCountAggregateOutputType | null
    _avg: ArticleViewAvgAggregateOutputType | null
    _sum: ArticleViewSumAggregateOutputType | null
    _min: ArticleViewMinAggregateOutputType | null
    _max: ArticleViewMaxAggregateOutputType | null
  }

  export type ArticleViewAvgAggregateOutputType = {
    duration: number | null
  }

  export type ArticleViewSumAggregateOutputType = {
    duration: number | null
  }

  export type ArticleViewMinAggregateOutputType = {
    id: string | null
    articleId: string | null
    userId: string | null
    duration: number | null
    viewedAt: Date | null
  }

  export type ArticleViewMaxAggregateOutputType = {
    id: string | null
    articleId: string | null
    userId: string | null
    duration: number | null
    viewedAt: Date | null
  }

  export type ArticleViewCountAggregateOutputType = {
    id: number
    articleId: number
    userId: number
    duration: number
    viewedAt: number
    _all: number
  }


  export type ArticleViewAvgAggregateInputType = {
    duration?: true
  }

  export type ArticleViewSumAggregateInputType = {
    duration?: true
  }

  export type ArticleViewMinAggregateInputType = {
    id?: true
    articleId?: true
    userId?: true
    duration?: true
    viewedAt?: true
  }

  export type ArticleViewMaxAggregateInputType = {
    id?: true
    articleId?: true
    userId?: true
    duration?: true
    viewedAt?: true
  }

  export type ArticleViewCountAggregateInputType = {
    id?: true
    articleId?: true
    userId?: true
    duration?: true
    viewedAt?: true
    _all?: true
  }

  export type ArticleViewAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ArticleView to aggregate.
     */
    where?: ArticleViewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleViews to fetch.
     */
    orderBy?: ArticleViewOrderByWithRelationInput | ArticleViewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ArticleViewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleViews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleViews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ArticleViews
    **/
    _count?: true | ArticleViewCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ArticleViewAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ArticleViewSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ArticleViewMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ArticleViewMaxAggregateInputType
  }

  export type GetArticleViewAggregateType<T extends ArticleViewAggregateArgs> = {
        [P in keyof T & keyof AggregateArticleView]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateArticleView[P]>
      : GetScalarType<T[P], AggregateArticleView[P]>
  }




  export type ArticleViewGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleViewWhereInput
    orderBy?: ArticleViewOrderByWithAggregationInput | ArticleViewOrderByWithAggregationInput[]
    by: ArticleViewScalarFieldEnum[] | ArticleViewScalarFieldEnum
    having?: ArticleViewScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ArticleViewCountAggregateInputType | true
    _avg?: ArticleViewAvgAggregateInputType
    _sum?: ArticleViewSumAggregateInputType
    _min?: ArticleViewMinAggregateInputType
    _max?: ArticleViewMaxAggregateInputType
  }

  export type ArticleViewGroupByOutputType = {
    id: string
    articleId: string
    userId: string
    duration: number | null
    viewedAt: Date
    _count: ArticleViewCountAggregateOutputType | null
    _avg: ArticleViewAvgAggregateOutputType | null
    _sum: ArticleViewSumAggregateOutputType | null
    _min: ArticleViewMinAggregateOutputType | null
    _max: ArticleViewMaxAggregateOutputType | null
  }

  type GetArticleViewGroupByPayload<T extends ArticleViewGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ArticleViewGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ArticleViewGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ArticleViewGroupByOutputType[P]>
            : GetScalarType<T[P], ArticleViewGroupByOutputType[P]>
        }
      >
    >


  export type ArticleViewSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    articleId?: boolean
    userId?: boolean
    duration?: boolean
    viewedAt?: boolean
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["articleView"]>

  export type ArticleViewSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    articleId?: boolean
    userId?: boolean
    duration?: boolean
    viewedAt?: boolean
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["articleView"]>

  export type ArticleViewSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    articleId?: boolean
    userId?: boolean
    duration?: boolean
    viewedAt?: boolean
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["articleView"]>

  export type ArticleViewSelectScalar = {
    id?: boolean
    articleId?: boolean
    userId?: boolean
    duration?: boolean
    viewedAt?: boolean
  }

  export type ArticleViewOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "articleId" | "userId" | "duration" | "viewedAt", ExtArgs["result"]["articleView"]>
  export type ArticleViewInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }
  export type ArticleViewIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }
  export type ArticleViewIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }

  export type $ArticleViewPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ArticleView"
    objects: {
      article: Prisma.$ArticlePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      articleId: string
      userId: string
      duration: number | null
      viewedAt: Date
    }, ExtArgs["result"]["articleView"]>
    composites: {}
  }

  type ArticleViewGetPayload<S extends boolean | null | undefined | ArticleViewDefaultArgs> = $Result.GetResult<Prisma.$ArticleViewPayload, S>

  type ArticleViewCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ArticleViewFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ArticleViewCountAggregateInputType | true
    }

  export interface ArticleViewDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ArticleView'], meta: { name: 'ArticleView' } }
    /**
     * Find zero or one ArticleView that matches the filter.
     * @param {ArticleViewFindUniqueArgs} args - Arguments to find a ArticleView
     * @example
     * // Get one ArticleView
     * const articleView = await prisma.articleView.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ArticleViewFindUniqueArgs>(args: SelectSubset<T, ArticleViewFindUniqueArgs<ExtArgs>>): Prisma__ArticleViewClient<$Result.GetResult<Prisma.$ArticleViewPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ArticleView that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ArticleViewFindUniqueOrThrowArgs} args - Arguments to find a ArticleView
     * @example
     * // Get one ArticleView
     * const articleView = await prisma.articleView.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ArticleViewFindUniqueOrThrowArgs>(args: SelectSubset<T, ArticleViewFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ArticleViewClient<$Result.GetResult<Prisma.$ArticleViewPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ArticleView that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleViewFindFirstArgs} args - Arguments to find a ArticleView
     * @example
     * // Get one ArticleView
     * const articleView = await prisma.articleView.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ArticleViewFindFirstArgs>(args?: SelectSubset<T, ArticleViewFindFirstArgs<ExtArgs>>): Prisma__ArticleViewClient<$Result.GetResult<Prisma.$ArticleViewPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ArticleView that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleViewFindFirstOrThrowArgs} args - Arguments to find a ArticleView
     * @example
     * // Get one ArticleView
     * const articleView = await prisma.articleView.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ArticleViewFindFirstOrThrowArgs>(args?: SelectSubset<T, ArticleViewFindFirstOrThrowArgs<ExtArgs>>): Prisma__ArticleViewClient<$Result.GetResult<Prisma.$ArticleViewPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ArticleViews that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleViewFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ArticleViews
     * const articleViews = await prisma.articleView.findMany()
     * 
     * // Get first 10 ArticleViews
     * const articleViews = await prisma.articleView.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const articleViewWithIdOnly = await prisma.articleView.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ArticleViewFindManyArgs>(args?: SelectSubset<T, ArticleViewFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticleViewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ArticleView.
     * @param {ArticleViewCreateArgs} args - Arguments to create a ArticleView.
     * @example
     * // Create one ArticleView
     * const ArticleView = await prisma.articleView.create({
     *   data: {
     *     // ... data to create a ArticleView
     *   }
     * })
     * 
     */
    create<T extends ArticleViewCreateArgs>(args: SelectSubset<T, ArticleViewCreateArgs<ExtArgs>>): Prisma__ArticleViewClient<$Result.GetResult<Prisma.$ArticleViewPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ArticleViews.
     * @param {ArticleViewCreateManyArgs} args - Arguments to create many ArticleViews.
     * @example
     * // Create many ArticleViews
     * const articleView = await prisma.articleView.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ArticleViewCreateManyArgs>(args?: SelectSubset<T, ArticleViewCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ArticleViews and returns the data saved in the database.
     * @param {ArticleViewCreateManyAndReturnArgs} args - Arguments to create many ArticleViews.
     * @example
     * // Create many ArticleViews
     * const articleView = await prisma.articleView.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ArticleViews and only return the `id`
     * const articleViewWithIdOnly = await prisma.articleView.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ArticleViewCreateManyAndReturnArgs>(args?: SelectSubset<T, ArticleViewCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticleViewPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ArticleView.
     * @param {ArticleViewDeleteArgs} args - Arguments to delete one ArticleView.
     * @example
     * // Delete one ArticleView
     * const ArticleView = await prisma.articleView.delete({
     *   where: {
     *     // ... filter to delete one ArticleView
     *   }
     * })
     * 
     */
    delete<T extends ArticleViewDeleteArgs>(args: SelectSubset<T, ArticleViewDeleteArgs<ExtArgs>>): Prisma__ArticleViewClient<$Result.GetResult<Prisma.$ArticleViewPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ArticleView.
     * @param {ArticleViewUpdateArgs} args - Arguments to update one ArticleView.
     * @example
     * // Update one ArticleView
     * const articleView = await prisma.articleView.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ArticleViewUpdateArgs>(args: SelectSubset<T, ArticleViewUpdateArgs<ExtArgs>>): Prisma__ArticleViewClient<$Result.GetResult<Prisma.$ArticleViewPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ArticleViews.
     * @param {ArticleViewDeleteManyArgs} args - Arguments to filter ArticleViews to delete.
     * @example
     * // Delete a few ArticleViews
     * const { count } = await prisma.articleView.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ArticleViewDeleteManyArgs>(args?: SelectSubset<T, ArticleViewDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ArticleViews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleViewUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ArticleViews
     * const articleView = await prisma.articleView.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ArticleViewUpdateManyArgs>(args: SelectSubset<T, ArticleViewUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ArticleViews and returns the data updated in the database.
     * @param {ArticleViewUpdateManyAndReturnArgs} args - Arguments to update many ArticleViews.
     * @example
     * // Update many ArticleViews
     * const articleView = await prisma.articleView.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ArticleViews and only return the `id`
     * const articleViewWithIdOnly = await prisma.articleView.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ArticleViewUpdateManyAndReturnArgs>(args: SelectSubset<T, ArticleViewUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticleViewPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ArticleView.
     * @param {ArticleViewUpsertArgs} args - Arguments to update or create a ArticleView.
     * @example
     * // Update or create a ArticleView
     * const articleView = await prisma.articleView.upsert({
     *   create: {
     *     // ... data to create a ArticleView
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ArticleView we want to update
     *   }
     * })
     */
    upsert<T extends ArticleViewUpsertArgs>(args: SelectSubset<T, ArticleViewUpsertArgs<ExtArgs>>): Prisma__ArticleViewClient<$Result.GetResult<Prisma.$ArticleViewPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ArticleViews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleViewCountArgs} args - Arguments to filter ArticleViews to count.
     * @example
     * // Count the number of ArticleViews
     * const count = await prisma.articleView.count({
     *   where: {
     *     // ... the filter for the ArticleViews we want to count
     *   }
     * })
    **/
    count<T extends ArticleViewCountArgs>(
      args?: Subset<T, ArticleViewCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ArticleViewCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ArticleView.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleViewAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ArticleViewAggregateArgs>(args: Subset<T, ArticleViewAggregateArgs>): Prisma.PrismaPromise<GetArticleViewAggregateType<T>>

    /**
     * Group by ArticleView.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleViewGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ArticleViewGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ArticleViewGroupByArgs['orderBy'] }
        : { orderBy?: ArticleViewGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ArticleViewGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetArticleViewGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ArticleView model
   */
  readonly fields: ArticleViewFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ArticleView.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ArticleViewClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    article<T extends ArticleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ArticleDefaultArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ArticleView model
   */
  interface ArticleViewFieldRefs {
    readonly id: FieldRef<"ArticleView", 'String'>
    readonly articleId: FieldRef<"ArticleView", 'String'>
    readonly userId: FieldRef<"ArticleView", 'String'>
    readonly duration: FieldRef<"ArticleView", 'Int'>
    readonly viewedAt: FieldRef<"ArticleView", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ArticleView findUnique
   */
  export type ArticleViewFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleView
     */
    select?: ArticleViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleView
     */
    omit?: ArticleViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleViewInclude<ExtArgs> | null
    /**
     * Filter, which ArticleView to fetch.
     */
    where: ArticleViewWhereUniqueInput
  }

  /**
   * ArticleView findUniqueOrThrow
   */
  export type ArticleViewFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleView
     */
    select?: ArticleViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleView
     */
    omit?: ArticleViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleViewInclude<ExtArgs> | null
    /**
     * Filter, which ArticleView to fetch.
     */
    where: ArticleViewWhereUniqueInput
  }

  /**
   * ArticleView findFirst
   */
  export type ArticleViewFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleView
     */
    select?: ArticleViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleView
     */
    omit?: ArticleViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleViewInclude<ExtArgs> | null
    /**
     * Filter, which ArticleView to fetch.
     */
    where?: ArticleViewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleViews to fetch.
     */
    orderBy?: ArticleViewOrderByWithRelationInput | ArticleViewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ArticleViews.
     */
    cursor?: ArticleViewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleViews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleViews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ArticleViews.
     */
    distinct?: ArticleViewScalarFieldEnum | ArticleViewScalarFieldEnum[]
  }

  /**
   * ArticleView findFirstOrThrow
   */
  export type ArticleViewFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleView
     */
    select?: ArticleViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleView
     */
    omit?: ArticleViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleViewInclude<ExtArgs> | null
    /**
     * Filter, which ArticleView to fetch.
     */
    where?: ArticleViewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleViews to fetch.
     */
    orderBy?: ArticleViewOrderByWithRelationInput | ArticleViewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ArticleViews.
     */
    cursor?: ArticleViewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleViews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleViews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ArticleViews.
     */
    distinct?: ArticleViewScalarFieldEnum | ArticleViewScalarFieldEnum[]
  }

  /**
   * ArticleView findMany
   */
  export type ArticleViewFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleView
     */
    select?: ArticleViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleView
     */
    omit?: ArticleViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleViewInclude<ExtArgs> | null
    /**
     * Filter, which ArticleViews to fetch.
     */
    where?: ArticleViewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleViews to fetch.
     */
    orderBy?: ArticleViewOrderByWithRelationInput | ArticleViewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ArticleViews.
     */
    cursor?: ArticleViewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleViews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleViews.
     */
    skip?: number
    distinct?: ArticleViewScalarFieldEnum | ArticleViewScalarFieldEnum[]
  }

  /**
   * ArticleView create
   */
  export type ArticleViewCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleView
     */
    select?: ArticleViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleView
     */
    omit?: ArticleViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleViewInclude<ExtArgs> | null
    /**
     * The data needed to create a ArticleView.
     */
    data: XOR<ArticleViewCreateInput, ArticleViewUncheckedCreateInput>
  }

  /**
   * ArticleView createMany
   */
  export type ArticleViewCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ArticleViews.
     */
    data: ArticleViewCreateManyInput | ArticleViewCreateManyInput[]
  }

  /**
   * ArticleView createManyAndReturn
   */
  export type ArticleViewCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleView
     */
    select?: ArticleViewSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleView
     */
    omit?: ArticleViewOmit<ExtArgs> | null
    /**
     * The data used to create many ArticleViews.
     */
    data: ArticleViewCreateManyInput | ArticleViewCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleViewIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ArticleView update
   */
  export type ArticleViewUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleView
     */
    select?: ArticleViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleView
     */
    omit?: ArticleViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleViewInclude<ExtArgs> | null
    /**
     * The data needed to update a ArticleView.
     */
    data: XOR<ArticleViewUpdateInput, ArticleViewUncheckedUpdateInput>
    /**
     * Choose, which ArticleView to update.
     */
    where: ArticleViewWhereUniqueInput
  }

  /**
   * ArticleView updateMany
   */
  export type ArticleViewUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ArticleViews.
     */
    data: XOR<ArticleViewUpdateManyMutationInput, ArticleViewUncheckedUpdateManyInput>
    /**
     * Filter which ArticleViews to update
     */
    where?: ArticleViewWhereInput
    /**
     * Limit how many ArticleViews to update.
     */
    limit?: number
  }

  /**
   * ArticleView updateManyAndReturn
   */
  export type ArticleViewUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleView
     */
    select?: ArticleViewSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleView
     */
    omit?: ArticleViewOmit<ExtArgs> | null
    /**
     * The data used to update ArticleViews.
     */
    data: XOR<ArticleViewUpdateManyMutationInput, ArticleViewUncheckedUpdateManyInput>
    /**
     * Filter which ArticleViews to update
     */
    where?: ArticleViewWhereInput
    /**
     * Limit how many ArticleViews to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleViewIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ArticleView upsert
   */
  export type ArticleViewUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleView
     */
    select?: ArticleViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleView
     */
    omit?: ArticleViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleViewInclude<ExtArgs> | null
    /**
     * The filter to search for the ArticleView to update in case it exists.
     */
    where: ArticleViewWhereUniqueInput
    /**
     * In case the ArticleView found by the `where` argument doesn't exist, create a new ArticleView with this data.
     */
    create: XOR<ArticleViewCreateInput, ArticleViewUncheckedCreateInput>
    /**
     * In case the ArticleView was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ArticleViewUpdateInput, ArticleViewUncheckedUpdateInput>
  }

  /**
   * ArticleView delete
   */
  export type ArticleViewDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleView
     */
    select?: ArticleViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleView
     */
    omit?: ArticleViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleViewInclude<ExtArgs> | null
    /**
     * Filter which ArticleView to delete.
     */
    where: ArticleViewWhereUniqueInput
  }

  /**
   * ArticleView deleteMany
   */
  export type ArticleViewDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ArticleViews to delete
     */
    where?: ArticleViewWhereInput
    /**
     * Limit how many ArticleViews to delete.
     */
    limit?: number
  }

  /**
   * ArticleView without action
   */
  export type ArticleViewDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleView
     */
    select?: ArticleViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleView
     */
    omit?: ArticleViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleViewInclude<ExtArgs> | null
  }


  /**
   * Model ArticleAttachment
   */

  export type AggregateArticleAttachment = {
    _count: ArticleAttachmentCountAggregateOutputType | null
    _avg: ArticleAttachmentAvgAggregateOutputType | null
    _sum: ArticleAttachmentSumAggregateOutputType | null
    _min: ArticleAttachmentMinAggregateOutputType | null
    _max: ArticleAttachmentMaxAggregateOutputType | null
  }

  export type ArticleAttachmentAvgAggregateOutputType = {
    size: number | null
  }

  export type ArticleAttachmentSumAggregateOutputType = {
    size: number | null
  }

  export type ArticleAttachmentMinAggregateOutputType = {
    id: string | null
    articleId: string | null
    filename: string | null
    originalName: string | null
    mimeType: string | null
    size: number | null
    url: string | null
    createdAt: Date | null
  }

  export type ArticleAttachmentMaxAggregateOutputType = {
    id: string | null
    articleId: string | null
    filename: string | null
    originalName: string | null
    mimeType: string | null
    size: number | null
    url: string | null
    createdAt: Date | null
  }

  export type ArticleAttachmentCountAggregateOutputType = {
    id: number
    articleId: number
    filename: number
    originalName: number
    mimeType: number
    size: number
    url: number
    createdAt: number
    _all: number
  }


  export type ArticleAttachmentAvgAggregateInputType = {
    size?: true
  }

  export type ArticleAttachmentSumAggregateInputType = {
    size?: true
  }

  export type ArticleAttachmentMinAggregateInputType = {
    id?: true
    articleId?: true
    filename?: true
    originalName?: true
    mimeType?: true
    size?: true
    url?: true
    createdAt?: true
  }

  export type ArticleAttachmentMaxAggregateInputType = {
    id?: true
    articleId?: true
    filename?: true
    originalName?: true
    mimeType?: true
    size?: true
    url?: true
    createdAt?: true
  }

  export type ArticleAttachmentCountAggregateInputType = {
    id?: true
    articleId?: true
    filename?: true
    originalName?: true
    mimeType?: true
    size?: true
    url?: true
    createdAt?: true
    _all?: true
  }

  export type ArticleAttachmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ArticleAttachment to aggregate.
     */
    where?: ArticleAttachmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleAttachments to fetch.
     */
    orderBy?: ArticleAttachmentOrderByWithRelationInput | ArticleAttachmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ArticleAttachmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleAttachments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleAttachments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ArticleAttachments
    **/
    _count?: true | ArticleAttachmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ArticleAttachmentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ArticleAttachmentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ArticleAttachmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ArticleAttachmentMaxAggregateInputType
  }

  export type GetArticleAttachmentAggregateType<T extends ArticleAttachmentAggregateArgs> = {
        [P in keyof T & keyof AggregateArticleAttachment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateArticleAttachment[P]>
      : GetScalarType<T[P], AggregateArticleAttachment[P]>
  }




  export type ArticleAttachmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleAttachmentWhereInput
    orderBy?: ArticleAttachmentOrderByWithAggregationInput | ArticleAttachmentOrderByWithAggregationInput[]
    by: ArticleAttachmentScalarFieldEnum[] | ArticleAttachmentScalarFieldEnum
    having?: ArticleAttachmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ArticleAttachmentCountAggregateInputType | true
    _avg?: ArticleAttachmentAvgAggregateInputType
    _sum?: ArticleAttachmentSumAggregateInputType
    _min?: ArticleAttachmentMinAggregateInputType
    _max?: ArticleAttachmentMaxAggregateInputType
  }

  export type ArticleAttachmentGroupByOutputType = {
    id: string
    articleId: string
    filename: string
    originalName: string
    mimeType: string
    size: number
    url: string
    createdAt: Date
    _count: ArticleAttachmentCountAggregateOutputType | null
    _avg: ArticleAttachmentAvgAggregateOutputType | null
    _sum: ArticleAttachmentSumAggregateOutputType | null
    _min: ArticleAttachmentMinAggregateOutputType | null
    _max: ArticleAttachmentMaxAggregateOutputType | null
  }

  type GetArticleAttachmentGroupByPayload<T extends ArticleAttachmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ArticleAttachmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ArticleAttachmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ArticleAttachmentGroupByOutputType[P]>
            : GetScalarType<T[P], ArticleAttachmentGroupByOutputType[P]>
        }
      >
    >


  export type ArticleAttachmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    articleId?: boolean
    filename?: boolean
    originalName?: boolean
    mimeType?: boolean
    size?: boolean
    url?: boolean
    createdAt?: boolean
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["articleAttachment"]>

  export type ArticleAttachmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    articleId?: boolean
    filename?: boolean
    originalName?: boolean
    mimeType?: boolean
    size?: boolean
    url?: boolean
    createdAt?: boolean
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["articleAttachment"]>

  export type ArticleAttachmentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    articleId?: boolean
    filename?: boolean
    originalName?: boolean
    mimeType?: boolean
    size?: boolean
    url?: boolean
    createdAt?: boolean
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["articleAttachment"]>

  export type ArticleAttachmentSelectScalar = {
    id?: boolean
    articleId?: boolean
    filename?: boolean
    originalName?: boolean
    mimeType?: boolean
    size?: boolean
    url?: boolean
    createdAt?: boolean
  }

  export type ArticleAttachmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "articleId" | "filename" | "originalName" | "mimeType" | "size" | "url" | "createdAt", ExtArgs["result"]["articleAttachment"]>
  export type ArticleAttachmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }
  export type ArticleAttachmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }
  export type ArticleAttachmentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }

  export type $ArticleAttachmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ArticleAttachment"
    objects: {
      article: Prisma.$ArticlePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      articleId: string
      filename: string
      originalName: string
      mimeType: string
      size: number
      url: string
      createdAt: Date
    }, ExtArgs["result"]["articleAttachment"]>
    composites: {}
  }

  type ArticleAttachmentGetPayload<S extends boolean | null | undefined | ArticleAttachmentDefaultArgs> = $Result.GetResult<Prisma.$ArticleAttachmentPayload, S>

  type ArticleAttachmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ArticleAttachmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ArticleAttachmentCountAggregateInputType | true
    }

  export interface ArticleAttachmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ArticleAttachment'], meta: { name: 'ArticleAttachment' } }
    /**
     * Find zero or one ArticleAttachment that matches the filter.
     * @param {ArticleAttachmentFindUniqueArgs} args - Arguments to find a ArticleAttachment
     * @example
     * // Get one ArticleAttachment
     * const articleAttachment = await prisma.articleAttachment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ArticleAttachmentFindUniqueArgs>(args: SelectSubset<T, ArticleAttachmentFindUniqueArgs<ExtArgs>>): Prisma__ArticleAttachmentClient<$Result.GetResult<Prisma.$ArticleAttachmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ArticleAttachment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ArticleAttachmentFindUniqueOrThrowArgs} args - Arguments to find a ArticleAttachment
     * @example
     * // Get one ArticleAttachment
     * const articleAttachment = await prisma.articleAttachment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ArticleAttachmentFindUniqueOrThrowArgs>(args: SelectSubset<T, ArticleAttachmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ArticleAttachmentClient<$Result.GetResult<Prisma.$ArticleAttachmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ArticleAttachment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleAttachmentFindFirstArgs} args - Arguments to find a ArticleAttachment
     * @example
     * // Get one ArticleAttachment
     * const articleAttachment = await prisma.articleAttachment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ArticleAttachmentFindFirstArgs>(args?: SelectSubset<T, ArticleAttachmentFindFirstArgs<ExtArgs>>): Prisma__ArticleAttachmentClient<$Result.GetResult<Prisma.$ArticleAttachmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ArticleAttachment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleAttachmentFindFirstOrThrowArgs} args - Arguments to find a ArticleAttachment
     * @example
     * // Get one ArticleAttachment
     * const articleAttachment = await prisma.articleAttachment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ArticleAttachmentFindFirstOrThrowArgs>(args?: SelectSubset<T, ArticleAttachmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__ArticleAttachmentClient<$Result.GetResult<Prisma.$ArticleAttachmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ArticleAttachments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleAttachmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ArticleAttachments
     * const articleAttachments = await prisma.articleAttachment.findMany()
     * 
     * // Get first 10 ArticleAttachments
     * const articleAttachments = await prisma.articleAttachment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const articleAttachmentWithIdOnly = await prisma.articleAttachment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ArticleAttachmentFindManyArgs>(args?: SelectSubset<T, ArticleAttachmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticleAttachmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ArticleAttachment.
     * @param {ArticleAttachmentCreateArgs} args - Arguments to create a ArticleAttachment.
     * @example
     * // Create one ArticleAttachment
     * const ArticleAttachment = await prisma.articleAttachment.create({
     *   data: {
     *     // ... data to create a ArticleAttachment
     *   }
     * })
     * 
     */
    create<T extends ArticleAttachmentCreateArgs>(args: SelectSubset<T, ArticleAttachmentCreateArgs<ExtArgs>>): Prisma__ArticleAttachmentClient<$Result.GetResult<Prisma.$ArticleAttachmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ArticleAttachments.
     * @param {ArticleAttachmentCreateManyArgs} args - Arguments to create many ArticleAttachments.
     * @example
     * // Create many ArticleAttachments
     * const articleAttachment = await prisma.articleAttachment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ArticleAttachmentCreateManyArgs>(args?: SelectSubset<T, ArticleAttachmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ArticleAttachments and returns the data saved in the database.
     * @param {ArticleAttachmentCreateManyAndReturnArgs} args - Arguments to create many ArticleAttachments.
     * @example
     * // Create many ArticleAttachments
     * const articleAttachment = await prisma.articleAttachment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ArticleAttachments and only return the `id`
     * const articleAttachmentWithIdOnly = await prisma.articleAttachment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ArticleAttachmentCreateManyAndReturnArgs>(args?: SelectSubset<T, ArticleAttachmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticleAttachmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ArticleAttachment.
     * @param {ArticleAttachmentDeleteArgs} args - Arguments to delete one ArticleAttachment.
     * @example
     * // Delete one ArticleAttachment
     * const ArticleAttachment = await prisma.articleAttachment.delete({
     *   where: {
     *     // ... filter to delete one ArticleAttachment
     *   }
     * })
     * 
     */
    delete<T extends ArticleAttachmentDeleteArgs>(args: SelectSubset<T, ArticleAttachmentDeleteArgs<ExtArgs>>): Prisma__ArticleAttachmentClient<$Result.GetResult<Prisma.$ArticleAttachmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ArticleAttachment.
     * @param {ArticleAttachmentUpdateArgs} args - Arguments to update one ArticleAttachment.
     * @example
     * // Update one ArticleAttachment
     * const articleAttachment = await prisma.articleAttachment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ArticleAttachmentUpdateArgs>(args: SelectSubset<T, ArticleAttachmentUpdateArgs<ExtArgs>>): Prisma__ArticleAttachmentClient<$Result.GetResult<Prisma.$ArticleAttachmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ArticleAttachments.
     * @param {ArticleAttachmentDeleteManyArgs} args - Arguments to filter ArticleAttachments to delete.
     * @example
     * // Delete a few ArticleAttachments
     * const { count } = await prisma.articleAttachment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ArticleAttachmentDeleteManyArgs>(args?: SelectSubset<T, ArticleAttachmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ArticleAttachments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleAttachmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ArticleAttachments
     * const articleAttachment = await prisma.articleAttachment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ArticleAttachmentUpdateManyArgs>(args: SelectSubset<T, ArticleAttachmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ArticleAttachments and returns the data updated in the database.
     * @param {ArticleAttachmentUpdateManyAndReturnArgs} args - Arguments to update many ArticleAttachments.
     * @example
     * // Update many ArticleAttachments
     * const articleAttachment = await prisma.articleAttachment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ArticleAttachments and only return the `id`
     * const articleAttachmentWithIdOnly = await prisma.articleAttachment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ArticleAttachmentUpdateManyAndReturnArgs>(args: SelectSubset<T, ArticleAttachmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticleAttachmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ArticleAttachment.
     * @param {ArticleAttachmentUpsertArgs} args - Arguments to update or create a ArticleAttachment.
     * @example
     * // Update or create a ArticleAttachment
     * const articleAttachment = await prisma.articleAttachment.upsert({
     *   create: {
     *     // ... data to create a ArticleAttachment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ArticleAttachment we want to update
     *   }
     * })
     */
    upsert<T extends ArticleAttachmentUpsertArgs>(args: SelectSubset<T, ArticleAttachmentUpsertArgs<ExtArgs>>): Prisma__ArticleAttachmentClient<$Result.GetResult<Prisma.$ArticleAttachmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ArticleAttachments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleAttachmentCountArgs} args - Arguments to filter ArticleAttachments to count.
     * @example
     * // Count the number of ArticleAttachments
     * const count = await prisma.articleAttachment.count({
     *   where: {
     *     // ... the filter for the ArticleAttachments we want to count
     *   }
     * })
    **/
    count<T extends ArticleAttachmentCountArgs>(
      args?: Subset<T, ArticleAttachmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ArticleAttachmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ArticleAttachment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleAttachmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ArticleAttachmentAggregateArgs>(args: Subset<T, ArticleAttachmentAggregateArgs>): Prisma.PrismaPromise<GetArticleAttachmentAggregateType<T>>

    /**
     * Group by ArticleAttachment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleAttachmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ArticleAttachmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ArticleAttachmentGroupByArgs['orderBy'] }
        : { orderBy?: ArticleAttachmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ArticleAttachmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetArticleAttachmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ArticleAttachment model
   */
  readonly fields: ArticleAttachmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ArticleAttachment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ArticleAttachmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    article<T extends ArticleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ArticleDefaultArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ArticleAttachment model
   */
  interface ArticleAttachmentFieldRefs {
    readonly id: FieldRef<"ArticleAttachment", 'String'>
    readonly articleId: FieldRef<"ArticleAttachment", 'String'>
    readonly filename: FieldRef<"ArticleAttachment", 'String'>
    readonly originalName: FieldRef<"ArticleAttachment", 'String'>
    readonly mimeType: FieldRef<"ArticleAttachment", 'String'>
    readonly size: FieldRef<"ArticleAttachment", 'Int'>
    readonly url: FieldRef<"ArticleAttachment", 'String'>
    readonly createdAt: FieldRef<"ArticleAttachment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ArticleAttachment findUnique
   */
  export type ArticleAttachmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleAttachment
     */
    select?: ArticleAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleAttachment
     */
    omit?: ArticleAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleAttachmentInclude<ExtArgs> | null
    /**
     * Filter, which ArticleAttachment to fetch.
     */
    where: ArticleAttachmentWhereUniqueInput
  }

  /**
   * ArticleAttachment findUniqueOrThrow
   */
  export type ArticleAttachmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleAttachment
     */
    select?: ArticleAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleAttachment
     */
    omit?: ArticleAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleAttachmentInclude<ExtArgs> | null
    /**
     * Filter, which ArticleAttachment to fetch.
     */
    where: ArticleAttachmentWhereUniqueInput
  }

  /**
   * ArticleAttachment findFirst
   */
  export type ArticleAttachmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleAttachment
     */
    select?: ArticleAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleAttachment
     */
    omit?: ArticleAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleAttachmentInclude<ExtArgs> | null
    /**
     * Filter, which ArticleAttachment to fetch.
     */
    where?: ArticleAttachmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleAttachments to fetch.
     */
    orderBy?: ArticleAttachmentOrderByWithRelationInput | ArticleAttachmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ArticleAttachments.
     */
    cursor?: ArticleAttachmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleAttachments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleAttachments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ArticleAttachments.
     */
    distinct?: ArticleAttachmentScalarFieldEnum | ArticleAttachmentScalarFieldEnum[]
  }

  /**
   * ArticleAttachment findFirstOrThrow
   */
  export type ArticleAttachmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleAttachment
     */
    select?: ArticleAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleAttachment
     */
    omit?: ArticleAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleAttachmentInclude<ExtArgs> | null
    /**
     * Filter, which ArticleAttachment to fetch.
     */
    where?: ArticleAttachmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleAttachments to fetch.
     */
    orderBy?: ArticleAttachmentOrderByWithRelationInput | ArticleAttachmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ArticleAttachments.
     */
    cursor?: ArticleAttachmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleAttachments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleAttachments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ArticleAttachments.
     */
    distinct?: ArticleAttachmentScalarFieldEnum | ArticleAttachmentScalarFieldEnum[]
  }

  /**
   * ArticleAttachment findMany
   */
  export type ArticleAttachmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleAttachment
     */
    select?: ArticleAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleAttachment
     */
    omit?: ArticleAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleAttachmentInclude<ExtArgs> | null
    /**
     * Filter, which ArticleAttachments to fetch.
     */
    where?: ArticleAttachmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleAttachments to fetch.
     */
    orderBy?: ArticleAttachmentOrderByWithRelationInput | ArticleAttachmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ArticleAttachments.
     */
    cursor?: ArticleAttachmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleAttachments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleAttachments.
     */
    skip?: number
    distinct?: ArticleAttachmentScalarFieldEnum | ArticleAttachmentScalarFieldEnum[]
  }

  /**
   * ArticleAttachment create
   */
  export type ArticleAttachmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleAttachment
     */
    select?: ArticleAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleAttachment
     */
    omit?: ArticleAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleAttachmentInclude<ExtArgs> | null
    /**
     * The data needed to create a ArticleAttachment.
     */
    data: XOR<ArticleAttachmentCreateInput, ArticleAttachmentUncheckedCreateInput>
  }

  /**
   * ArticleAttachment createMany
   */
  export type ArticleAttachmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ArticleAttachments.
     */
    data: ArticleAttachmentCreateManyInput | ArticleAttachmentCreateManyInput[]
  }

  /**
   * ArticleAttachment createManyAndReturn
   */
  export type ArticleAttachmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleAttachment
     */
    select?: ArticleAttachmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleAttachment
     */
    omit?: ArticleAttachmentOmit<ExtArgs> | null
    /**
     * The data used to create many ArticleAttachments.
     */
    data: ArticleAttachmentCreateManyInput | ArticleAttachmentCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleAttachmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ArticleAttachment update
   */
  export type ArticleAttachmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleAttachment
     */
    select?: ArticleAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleAttachment
     */
    omit?: ArticleAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleAttachmentInclude<ExtArgs> | null
    /**
     * The data needed to update a ArticleAttachment.
     */
    data: XOR<ArticleAttachmentUpdateInput, ArticleAttachmentUncheckedUpdateInput>
    /**
     * Choose, which ArticleAttachment to update.
     */
    where: ArticleAttachmentWhereUniqueInput
  }

  /**
   * ArticleAttachment updateMany
   */
  export type ArticleAttachmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ArticleAttachments.
     */
    data: XOR<ArticleAttachmentUpdateManyMutationInput, ArticleAttachmentUncheckedUpdateManyInput>
    /**
     * Filter which ArticleAttachments to update
     */
    where?: ArticleAttachmentWhereInput
    /**
     * Limit how many ArticleAttachments to update.
     */
    limit?: number
  }

  /**
   * ArticleAttachment updateManyAndReturn
   */
  export type ArticleAttachmentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleAttachment
     */
    select?: ArticleAttachmentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleAttachment
     */
    omit?: ArticleAttachmentOmit<ExtArgs> | null
    /**
     * The data used to update ArticleAttachments.
     */
    data: XOR<ArticleAttachmentUpdateManyMutationInput, ArticleAttachmentUncheckedUpdateManyInput>
    /**
     * Filter which ArticleAttachments to update
     */
    where?: ArticleAttachmentWhereInput
    /**
     * Limit how many ArticleAttachments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleAttachmentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ArticleAttachment upsert
   */
  export type ArticleAttachmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleAttachment
     */
    select?: ArticleAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleAttachment
     */
    omit?: ArticleAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleAttachmentInclude<ExtArgs> | null
    /**
     * The filter to search for the ArticleAttachment to update in case it exists.
     */
    where: ArticleAttachmentWhereUniqueInput
    /**
     * In case the ArticleAttachment found by the `where` argument doesn't exist, create a new ArticleAttachment with this data.
     */
    create: XOR<ArticleAttachmentCreateInput, ArticleAttachmentUncheckedCreateInput>
    /**
     * In case the ArticleAttachment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ArticleAttachmentUpdateInput, ArticleAttachmentUncheckedUpdateInput>
  }

  /**
   * ArticleAttachment delete
   */
  export type ArticleAttachmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleAttachment
     */
    select?: ArticleAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleAttachment
     */
    omit?: ArticleAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleAttachmentInclude<ExtArgs> | null
    /**
     * Filter which ArticleAttachment to delete.
     */
    where: ArticleAttachmentWhereUniqueInput
  }

  /**
   * ArticleAttachment deleteMany
   */
  export type ArticleAttachmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ArticleAttachments to delete
     */
    where?: ArticleAttachmentWhereInput
    /**
     * Limit how many ArticleAttachments to delete.
     */
    limit?: number
  }

  /**
   * ArticleAttachment without action
   */
  export type ArticleAttachmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleAttachment
     */
    select?: ArticleAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleAttachment
     */
    omit?: ArticleAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleAttachmentInclude<ExtArgs> | null
  }


  /**
   * Model Template
   */

  export type AggregateTemplate = {
    _count: TemplateCountAggregateOutputType | null
    _avg: TemplateAvgAggregateOutputType | null
    _sum: TemplateSumAggregateOutputType | null
    _min: TemplateMinAggregateOutputType | null
    _max: TemplateMaxAggregateOutputType | null
  }

  export type TemplateAvgAggregateOutputType = {
    useCount: number | null
  }

  export type TemplateSumAggregateOutputType = {
    useCount: number | null
  }

  export type TemplateMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    content: string | null
    categoryId: string | null
    authorId: string | null
    type: $Enums.TemplateType | null
    tags: string | null
    variables: string | null
    useCount: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TemplateMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    content: string | null
    categoryId: string | null
    authorId: string | null
    type: $Enums.TemplateType | null
    tags: string | null
    variables: string | null
    useCount: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TemplateCountAggregateOutputType = {
    id: number
    name: number
    description: number
    content: number
    categoryId: number
    authorId: number
    type: number
    tags: number
    variables: number
    useCount: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TemplateAvgAggregateInputType = {
    useCount?: true
  }

  export type TemplateSumAggregateInputType = {
    useCount?: true
  }

  export type TemplateMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    content?: true
    categoryId?: true
    authorId?: true
    type?: true
    tags?: true
    variables?: true
    useCount?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TemplateMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    content?: true
    categoryId?: true
    authorId?: true
    type?: true
    tags?: true
    variables?: true
    useCount?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TemplateCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    content?: true
    categoryId?: true
    authorId?: true
    type?: true
    tags?: true
    variables?: true
    useCount?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TemplateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Template to aggregate.
     */
    where?: TemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Templates to fetch.
     */
    orderBy?: TemplateOrderByWithRelationInput | TemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Templates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Templates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Templates
    **/
    _count?: true | TemplateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TemplateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TemplateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TemplateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TemplateMaxAggregateInputType
  }

  export type GetTemplateAggregateType<T extends TemplateAggregateArgs> = {
        [P in keyof T & keyof AggregateTemplate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTemplate[P]>
      : GetScalarType<T[P], AggregateTemplate[P]>
  }




  export type TemplateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TemplateWhereInput
    orderBy?: TemplateOrderByWithAggregationInput | TemplateOrderByWithAggregationInput[]
    by: TemplateScalarFieldEnum[] | TemplateScalarFieldEnum
    having?: TemplateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TemplateCountAggregateInputType | true
    _avg?: TemplateAvgAggregateInputType
    _sum?: TemplateSumAggregateInputType
    _min?: TemplateMinAggregateInputType
    _max?: TemplateMaxAggregateInputType
  }

  export type TemplateGroupByOutputType = {
    id: string
    name: string
    description: string | null
    content: string
    categoryId: string
    authorId: string
    type: $Enums.TemplateType
    tags: string | null
    variables: string | null
    useCount: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: TemplateCountAggregateOutputType | null
    _avg: TemplateAvgAggregateOutputType | null
    _sum: TemplateSumAggregateOutputType | null
    _min: TemplateMinAggregateOutputType | null
    _max: TemplateMaxAggregateOutputType | null
  }

  type GetTemplateGroupByPayload<T extends TemplateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TemplateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TemplateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TemplateGroupByOutputType[P]>
            : GetScalarType<T[P], TemplateGroupByOutputType[P]>
        }
      >
    >


  export type TemplateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    content?: boolean
    categoryId?: boolean
    authorId?: boolean
    type?: boolean
    tags?: boolean
    variables?: boolean
    useCount?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    category?: boolean | KnowledgeCategoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["template"]>

  export type TemplateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    content?: boolean
    categoryId?: boolean
    authorId?: boolean
    type?: boolean
    tags?: boolean
    variables?: boolean
    useCount?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    category?: boolean | KnowledgeCategoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["template"]>

  export type TemplateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    content?: boolean
    categoryId?: boolean
    authorId?: boolean
    type?: boolean
    tags?: boolean
    variables?: boolean
    useCount?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    category?: boolean | KnowledgeCategoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["template"]>

  export type TemplateSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    content?: boolean
    categoryId?: boolean
    authorId?: boolean
    type?: boolean
    tags?: boolean
    variables?: boolean
    useCount?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TemplateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "content" | "categoryId" | "authorId" | "type" | "tags" | "variables" | "useCount" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["template"]>
  export type TemplateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | KnowledgeCategoryDefaultArgs<ExtArgs>
  }
  export type TemplateIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | KnowledgeCategoryDefaultArgs<ExtArgs>
  }
  export type TemplateIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | KnowledgeCategoryDefaultArgs<ExtArgs>
  }

  export type $TemplatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Template"
    objects: {
      category: Prisma.$KnowledgeCategoryPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      content: string
      categoryId: string
      authorId: string
      type: $Enums.TemplateType
      tags: string | null
      variables: string | null
      useCount: number
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["template"]>
    composites: {}
  }

  type TemplateGetPayload<S extends boolean | null | undefined | TemplateDefaultArgs> = $Result.GetResult<Prisma.$TemplatePayload, S>

  type TemplateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TemplateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TemplateCountAggregateInputType | true
    }

  export interface TemplateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Template'], meta: { name: 'Template' } }
    /**
     * Find zero or one Template that matches the filter.
     * @param {TemplateFindUniqueArgs} args - Arguments to find a Template
     * @example
     * // Get one Template
     * const template = await prisma.template.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TemplateFindUniqueArgs>(args: SelectSubset<T, TemplateFindUniqueArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Template that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TemplateFindUniqueOrThrowArgs} args - Arguments to find a Template
     * @example
     * // Get one Template
     * const template = await prisma.template.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TemplateFindUniqueOrThrowArgs>(args: SelectSubset<T, TemplateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Template that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateFindFirstArgs} args - Arguments to find a Template
     * @example
     * // Get one Template
     * const template = await prisma.template.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TemplateFindFirstArgs>(args?: SelectSubset<T, TemplateFindFirstArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Template that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateFindFirstOrThrowArgs} args - Arguments to find a Template
     * @example
     * // Get one Template
     * const template = await prisma.template.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TemplateFindFirstOrThrowArgs>(args?: SelectSubset<T, TemplateFindFirstOrThrowArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Templates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Templates
     * const templates = await prisma.template.findMany()
     * 
     * // Get first 10 Templates
     * const templates = await prisma.template.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const templateWithIdOnly = await prisma.template.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TemplateFindManyArgs>(args?: SelectSubset<T, TemplateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Template.
     * @param {TemplateCreateArgs} args - Arguments to create a Template.
     * @example
     * // Create one Template
     * const Template = await prisma.template.create({
     *   data: {
     *     // ... data to create a Template
     *   }
     * })
     * 
     */
    create<T extends TemplateCreateArgs>(args: SelectSubset<T, TemplateCreateArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Templates.
     * @param {TemplateCreateManyArgs} args - Arguments to create many Templates.
     * @example
     * // Create many Templates
     * const template = await prisma.template.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TemplateCreateManyArgs>(args?: SelectSubset<T, TemplateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Templates and returns the data saved in the database.
     * @param {TemplateCreateManyAndReturnArgs} args - Arguments to create many Templates.
     * @example
     * // Create many Templates
     * const template = await prisma.template.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Templates and only return the `id`
     * const templateWithIdOnly = await prisma.template.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TemplateCreateManyAndReturnArgs>(args?: SelectSubset<T, TemplateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Template.
     * @param {TemplateDeleteArgs} args - Arguments to delete one Template.
     * @example
     * // Delete one Template
     * const Template = await prisma.template.delete({
     *   where: {
     *     // ... filter to delete one Template
     *   }
     * })
     * 
     */
    delete<T extends TemplateDeleteArgs>(args: SelectSubset<T, TemplateDeleteArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Template.
     * @param {TemplateUpdateArgs} args - Arguments to update one Template.
     * @example
     * // Update one Template
     * const template = await prisma.template.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TemplateUpdateArgs>(args: SelectSubset<T, TemplateUpdateArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Templates.
     * @param {TemplateDeleteManyArgs} args - Arguments to filter Templates to delete.
     * @example
     * // Delete a few Templates
     * const { count } = await prisma.template.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TemplateDeleteManyArgs>(args?: SelectSubset<T, TemplateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Templates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Templates
     * const template = await prisma.template.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TemplateUpdateManyArgs>(args: SelectSubset<T, TemplateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Templates and returns the data updated in the database.
     * @param {TemplateUpdateManyAndReturnArgs} args - Arguments to update many Templates.
     * @example
     * // Update many Templates
     * const template = await prisma.template.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Templates and only return the `id`
     * const templateWithIdOnly = await prisma.template.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TemplateUpdateManyAndReturnArgs>(args: SelectSubset<T, TemplateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Template.
     * @param {TemplateUpsertArgs} args - Arguments to update or create a Template.
     * @example
     * // Update or create a Template
     * const template = await prisma.template.upsert({
     *   create: {
     *     // ... data to create a Template
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Template we want to update
     *   }
     * })
     */
    upsert<T extends TemplateUpsertArgs>(args: SelectSubset<T, TemplateUpsertArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Templates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateCountArgs} args - Arguments to filter Templates to count.
     * @example
     * // Count the number of Templates
     * const count = await prisma.template.count({
     *   where: {
     *     // ... the filter for the Templates we want to count
     *   }
     * })
    **/
    count<T extends TemplateCountArgs>(
      args?: Subset<T, TemplateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TemplateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Template.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TemplateAggregateArgs>(args: Subset<T, TemplateAggregateArgs>): Prisma.PrismaPromise<GetTemplateAggregateType<T>>

    /**
     * Group by Template.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TemplateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TemplateGroupByArgs['orderBy'] }
        : { orderBy?: TemplateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TemplateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTemplateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Template model
   */
  readonly fields: TemplateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Template.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TemplateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    category<T extends KnowledgeCategoryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, KnowledgeCategoryDefaultArgs<ExtArgs>>): Prisma__KnowledgeCategoryClient<$Result.GetResult<Prisma.$KnowledgeCategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Template model
   */
  interface TemplateFieldRefs {
    readonly id: FieldRef<"Template", 'String'>
    readonly name: FieldRef<"Template", 'String'>
    readonly description: FieldRef<"Template", 'String'>
    readonly content: FieldRef<"Template", 'String'>
    readonly categoryId: FieldRef<"Template", 'String'>
    readonly authorId: FieldRef<"Template", 'String'>
    readonly type: FieldRef<"Template", 'TemplateType'>
    readonly tags: FieldRef<"Template", 'String'>
    readonly variables: FieldRef<"Template", 'String'>
    readonly useCount: FieldRef<"Template", 'Int'>
    readonly isActive: FieldRef<"Template", 'Boolean'>
    readonly createdAt: FieldRef<"Template", 'DateTime'>
    readonly updatedAt: FieldRef<"Template", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Template findUnique
   */
  export type TemplateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * Filter, which Template to fetch.
     */
    where: TemplateWhereUniqueInput
  }

  /**
   * Template findUniqueOrThrow
   */
  export type TemplateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * Filter, which Template to fetch.
     */
    where: TemplateWhereUniqueInput
  }

  /**
   * Template findFirst
   */
  export type TemplateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * Filter, which Template to fetch.
     */
    where?: TemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Templates to fetch.
     */
    orderBy?: TemplateOrderByWithRelationInput | TemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Templates.
     */
    cursor?: TemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Templates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Templates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Templates.
     */
    distinct?: TemplateScalarFieldEnum | TemplateScalarFieldEnum[]
  }

  /**
   * Template findFirstOrThrow
   */
  export type TemplateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * Filter, which Template to fetch.
     */
    where?: TemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Templates to fetch.
     */
    orderBy?: TemplateOrderByWithRelationInput | TemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Templates.
     */
    cursor?: TemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Templates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Templates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Templates.
     */
    distinct?: TemplateScalarFieldEnum | TemplateScalarFieldEnum[]
  }

  /**
   * Template findMany
   */
  export type TemplateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * Filter, which Templates to fetch.
     */
    where?: TemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Templates to fetch.
     */
    orderBy?: TemplateOrderByWithRelationInput | TemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Templates.
     */
    cursor?: TemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Templates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Templates.
     */
    skip?: number
    distinct?: TemplateScalarFieldEnum | TemplateScalarFieldEnum[]
  }

  /**
   * Template create
   */
  export type TemplateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * The data needed to create a Template.
     */
    data: XOR<TemplateCreateInput, TemplateUncheckedCreateInput>
  }

  /**
   * Template createMany
   */
  export type TemplateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Templates.
     */
    data: TemplateCreateManyInput | TemplateCreateManyInput[]
  }

  /**
   * Template createManyAndReturn
   */
  export type TemplateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * The data used to create many Templates.
     */
    data: TemplateCreateManyInput | TemplateCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Template update
   */
  export type TemplateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * The data needed to update a Template.
     */
    data: XOR<TemplateUpdateInput, TemplateUncheckedUpdateInput>
    /**
     * Choose, which Template to update.
     */
    where: TemplateWhereUniqueInput
  }

  /**
   * Template updateMany
   */
  export type TemplateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Templates.
     */
    data: XOR<TemplateUpdateManyMutationInput, TemplateUncheckedUpdateManyInput>
    /**
     * Filter which Templates to update
     */
    where?: TemplateWhereInput
    /**
     * Limit how many Templates to update.
     */
    limit?: number
  }

  /**
   * Template updateManyAndReturn
   */
  export type TemplateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * The data used to update Templates.
     */
    data: XOR<TemplateUpdateManyMutationInput, TemplateUncheckedUpdateManyInput>
    /**
     * Filter which Templates to update
     */
    where?: TemplateWhereInput
    /**
     * Limit how many Templates to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Template upsert
   */
  export type TemplateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * The filter to search for the Template to update in case it exists.
     */
    where: TemplateWhereUniqueInput
    /**
     * In case the Template found by the `where` argument doesn't exist, create a new Template with this data.
     */
    create: XOR<TemplateCreateInput, TemplateUncheckedCreateInput>
    /**
     * In case the Template was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TemplateUpdateInput, TemplateUncheckedUpdateInput>
  }

  /**
   * Template delete
   */
  export type TemplateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * Filter which Template to delete.
     */
    where: TemplateWhereUniqueInput
  }

  /**
   * Template deleteMany
   */
  export type TemplateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Templates to delete
     */
    where?: TemplateWhereInput
    /**
     * Limit how many Templates to delete.
     */
    limit?: number
  }

  /**
   * Template without action
   */
  export type TemplateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Template
     */
    omit?: TemplateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
  }


  /**
   * Model FAQ
   */

  export type AggregateFAQ = {
    _count: FAQCountAggregateOutputType | null
    _avg: FAQAvgAggregateOutputType | null
    _sum: FAQSumAggregateOutputType | null
    _min: FAQMinAggregateOutputType | null
    _max: FAQMaxAggregateOutputType | null
  }

  export type FAQAvgAggregateOutputType = {
    viewCount: number | null
    helpfulCount: number | null
  }

  export type FAQSumAggregateOutputType = {
    viewCount: number | null
    helpfulCount: number | null
  }

  export type FAQMinAggregateOutputType = {
    id: string | null
    question: string | null
    answer: string | null
    categoryId: string | null
    authorId: string | null
    viewCount: number | null
    helpfulCount: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FAQMaxAggregateOutputType = {
    id: string | null
    question: string | null
    answer: string | null
    categoryId: string | null
    authorId: string | null
    viewCount: number | null
    helpfulCount: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FAQCountAggregateOutputType = {
    id: number
    question: number
    answer: number
    categoryId: number
    authorId: number
    viewCount: number
    helpfulCount: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FAQAvgAggregateInputType = {
    viewCount?: true
    helpfulCount?: true
  }

  export type FAQSumAggregateInputType = {
    viewCount?: true
    helpfulCount?: true
  }

  export type FAQMinAggregateInputType = {
    id?: true
    question?: true
    answer?: true
    categoryId?: true
    authorId?: true
    viewCount?: true
    helpfulCount?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FAQMaxAggregateInputType = {
    id?: true
    question?: true
    answer?: true
    categoryId?: true
    authorId?: true
    viewCount?: true
    helpfulCount?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FAQCountAggregateInputType = {
    id?: true
    question?: true
    answer?: true
    categoryId?: true
    authorId?: true
    viewCount?: true
    helpfulCount?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FAQAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FAQ to aggregate.
     */
    where?: FAQWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FAQS to fetch.
     */
    orderBy?: FAQOrderByWithRelationInput | FAQOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FAQWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FAQS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FAQS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FAQS
    **/
    _count?: true | FAQCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FAQAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FAQSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FAQMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FAQMaxAggregateInputType
  }

  export type GetFAQAggregateType<T extends FAQAggregateArgs> = {
        [P in keyof T & keyof AggregateFAQ]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFAQ[P]>
      : GetScalarType<T[P], AggregateFAQ[P]>
  }




  export type FAQGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FAQWhereInput
    orderBy?: FAQOrderByWithAggregationInput | FAQOrderByWithAggregationInput[]
    by: FAQScalarFieldEnum[] | FAQScalarFieldEnum
    having?: FAQScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FAQCountAggregateInputType | true
    _avg?: FAQAvgAggregateInputType
    _sum?: FAQSumAggregateInputType
    _min?: FAQMinAggregateInputType
    _max?: FAQMaxAggregateInputType
  }

  export type FAQGroupByOutputType = {
    id: string
    question: string
    answer: string
    categoryId: string
    authorId: string
    viewCount: number
    helpfulCount: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: FAQCountAggregateOutputType | null
    _avg: FAQAvgAggregateOutputType | null
    _sum: FAQSumAggregateOutputType | null
    _min: FAQMinAggregateOutputType | null
    _max: FAQMaxAggregateOutputType | null
  }

  type GetFAQGroupByPayload<T extends FAQGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FAQGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FAQGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FAQGroupByOutputType[P]>
            : GetScalarType<T[P], FAQGroupByOutputType[P]>
        }
      >
    >


  export type FAQSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    question?: boolean
    answer?: boolean
    categoryId?: boolean
    authorId?: boolean
    viewCount?: boolean
    helpfulCount?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    category?: boolean | KnowledgeCategoryDefaultArgs<ExtArgs>
    feedback?: boolean | FAQ$feedbackArgs<ExtArgs>
    _count?: boolean | FAQCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fAQ"]>

  export type FAQSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    question?: boolean
    answer?: boolean
    categoryId?: boolean
    authorId?: boolean
    viewCount?: boolean
    helpfulCount?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    category?: boolean | KnowledgeCategoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fAQ"]>

  export type FAQSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    question?: boolean
    answer?: boolean
    categoryId?: boolean
    authorId?: boolean
    viewCount?: boolean
    helpfulCount?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    category?: boolean | KnowledgeCategoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fAQ"]>

  export type FAQSelectScalar = {
    id?: boolean
    question?: boolean
    answer?: boolean
    categoryId?: boolean
    authorId?: boolean
    viewCount?: boolean
    helpfulCount?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type FAQOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "question" | "answer" | "categoryId" | "authorId" | "viewCount" | "helpfulCount" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["fAQ"]>
  export type FAQInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | KnowledgeCategoryDefaultArgs<ExtArgs>
    feedback?: boolean | FAQ$feedbackArgs<ExtArgs>
    _count?: boolean | FAQCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type FAQIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | KnowledgeCategoryDefaultArgs<ExtArgs>
  }
  export type FAQIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | KnowledgeCategoryDefaultArgs<ExtArgs>
  }

  export type $FAQPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FAQ"
    objects: {
      category: Prisma.$KnowledgeCategoryPayload<ExtArgs>
      feedback: Prisma.$FAQFeedbackPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      question: string
      answer: string
      categoryId: string
      authorId: string
      viewCount: number
      helpfulCount: number
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["fAQ"]>
    composites: {}
  }

  type FAQGetPayload<S extends boolean | null | undefined | FAQDefaultArgs> = $Result.GetResult<Prisma.$FAQPayload, S>

  type FAQCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FAQFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FAQCountAggregateInputType | true
    }

  export interface FAQDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FAQ'], meta: { name: 'FAQ' } }
    /**
     * Find zero or one FAQ that matches the filter.
     * @param {FAQFindUniqueArgs} args - Arguments to find a FAQ
     * @example
     * // Get one FAQ
     * const fAQ = await prisma.fAQ.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FAQFindUniqueArgs>(args: SelectSubset<T, FAQFindUniqueArgs<ExtArgs>>): Prisma__FAQClient<$Result.GetResult<Prisma.$FAQPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FAQ that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FAQFindUniqueOrThrowArgs} args - Arguments to find a FAQ
     * @example
     * // Get one FAQ
     * const fAQ = await prisma.fAQ.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FAQFindUniqueOrThrowArgs>(args: SelectSubset<T, FAQFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FAQClient<$Result.GetResult<Prisma.$FAQPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FAQ that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FAQFindFirstArgs} args - Arguments to find a FAQ
     * @example
     * // Get one FAQ
     * const fAQ = await prisma.fAQ.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FAQFindFirstArgs>(args?: SelectSubset<T, FAQFindFirstArgs<ExtArgs>>): Prisma__FAQClient<$Result.GetResult<Prisma.$FAQPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FAQ that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FAQFindFirstOrThrowArgs} args - Arguments to find a FAQ
     * @example
     * // Get one FAQ
     * const fAQ = await prisma.fAQ.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FAQFindFirstOrThrowArgs>(args?: SelectSubset<T, FAQFindFirstOrThrowArgs<ExtArgs>>): Prisma__FAQClient<$Result.GetResult<Prisma.$FAQPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FAQS that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FAQFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FAQS
     * const fAQS = await prisma.fAQ.findMany()
     * 
     * // Get first 10 FAQS
     * const fAQS = await prisma.fAQ.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fAQWithIdOnly = await prisma.fAQ.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FAQFindManyArgs>(args?: SelectSubset<T, FAQFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FAQPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FAQ.
     * @param {FAQCreateArgs} args - Arguments to create a FAQ.
     * @example
     * // Create one FAQ
     * const FAQ = await prisma.fAQ.create({
     *   data: {
     *     // ... data to create a FAQ
     *   }
     * })
     * 
     */
    create<T extends FAQCreateArgs>(args: SelectSubset<T, FAQCreateArgs<ExtArgs>>): Prisma__FAQClient<$Result.GetResult<Prisma.$FAQPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FAQS.
     * @param {FAQCreateManyArgs} args - Arguments to create many FAQS.
     * @example
     * // Create many FAQS
     * const fAQ = await prisma.fAQ.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FAQCreateManyArgs>(args?: SelectSubset<T, FAQCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FAQS and returns the data saved in the database.
     * @param {FAQCreateManyAndReturnArgs} args - Arguments to create many FAQS.
     * @example
     * // Create many FAQS
     * const fAQ = await prisma.fAQ.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FAQS and only return the `id`
     * const fAQWithIdOnly = await prisma.fAQ.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FAQCreateManyAndReturnArgs>(args?: SelectSubset<T, FAQCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FAQPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FAQ.
     * @param {FAQDeleteArgs} args - Arguments to delete one FAQ.
     * @example
     * // Delete one FAQ
     * const FAQ = await prisma.fAQ.delete({
     *   where: {
     *     // ... filter to delete one FAQ
     *   }
     * })
     * 
     */
    delete<T extends FAQDeleteArgs>(args: SelectSubset<T, FAQDeleteArgs<ExtArgs>>): Prisma__FAQClient<$Result.GetResult<Prisma.$FAQPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FAQ.
     * @param {FAQUpdateArgs} args - Arguments to update one FAQ.
     * @example
     * // Update one FAQ
     * const fAQ = await prisma.fAQ.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FAQUpdateArgs>(args: SelectSubset<T, FAQUpdateArgs<ExtArgs>>): Prisma__FAQClient<$Result.GetResult<Prisma.$FAQPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FAQS.
     * @param {FAQDeleteManyArgs} args - Arguments to filter FAQS to delete.
     * @example
     * // Delete a few FAQS
     * const { count } = await prisma.fAQ.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FAQDeleteManyArgs>(args?: SelectSubset<T, FAQDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FAQS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FAQUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FAQS
     * const fAQ = await prisma.fAQ.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FAQUpdateManyArgs>(args: SelectSubset<T, FAQUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FAQS and returns the data updated in the database.
     * @param {FAQUpdateManyAndReturnArgs} args - Arguments to update many FAQS.
     * @example
     * // Update many FAQS
     * const fAQ = await prisma.fAQ.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FAQS and only return the `id`
     * const fAQWithIdOnly = await prisma.fAQ.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FAQUpdateManyAndReturnArgs>(args: SelectSubset<T, FAQUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FAQPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FAQ.
     * @param {FAQUpsertArgs} args - Arguments to update or create a FAQ.
     * @example
     * // Update or create a FAQ
     * const fAQ = await prisma.fAQ.upsert({
     *   create: {
     *     // ... data to create a FAQ
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FAQ we want to update
     *   }
     * })
     */
    upsert<T extends FAQUpsertArgs>(args: SelectSubset<T, FAQUpsertArgs<ExtArgs>>): Prisma__FAQClient<$Result.GetResult<Prisma.$FAQPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FAQS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FAQCountArgs} args - Arguments to filter FAQS to count.
     * @example
     * // Count the number of FAQS
     * const count = await prisma.fAQ.count({
     *   where: {
     *     // ... the filter for the FAQS we want to count
     *   }
     * })
    **/
    count<T extends FAQCountArgs>(
      args?: Subset<T, FAQCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FAQCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FAQ.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FAQAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FAQAggregateArgs>(args: Subset<T, FAQAggregateArgs>): Prisma.PrismaPromise<GetFAQAggregateType<T>>

    /**
     * Group by FAQ.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FAQGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FAQGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FAQGroupByArgs['orderBy'] }
        : { orderBy?: FAQGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FAQGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFAQGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FAQ model
   */
  readonly fields: FAQFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FAQ.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FAQClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    category<T extends KnowledgeCategoryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, KnowledgeCategoryDefaultArgs<ExtArgs>>): Prisma__KnowledgeCategoryClient<$Result.GetResult<Prisma.$KnowledgeCategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    feedback<T extends FAQ$feedbackArgs<ExtArgs> = {}>(args?: Subset<T, FAQ$feedbackArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FAQFeedbackPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FAQ model
   */
  interface FAQFieldRefs {
    readonly id: FieldRef<"FAQ", 'String'>
    readonly question: FieldRef<"FAQ", 'String'>
    readonly answer: FieldRef<"FAQ", 'String'>
    readonly categoryId: FieldRef<"FAQ", 'String'>
    readonly authorId: FieldRef<"FAQ", 'String'>
    readonly viewCount: FieldRef<"FAQ", 'Int'>
    readonly helpfulCount: FieldRef<"FAQ", 'Int'>
    readonly isActive: FieldRef<"FAQ", 'Boolean'>
    readonly createdAt: FieldRef<"FAQ", 'DateTime'>
    readonly updatedAt: FieldRef<"FAQ", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FAQ findUnique
   */
  export type FAQFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FAQ
     */
    select?: FAQSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FAQ
     */
    omit?: FAQOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FAQInclude<ExtArgs> | null
    /**
     * Filter, which FAQ to fetch.
     */
    where: FAQWhereUniqueInput
  }

  /**
   * FAQ findUniqueOrThrow
   */
  export type FAQFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FAQ
     */
    select?: FAQSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FAQ
     */
    omit?: FAQOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FAQInclude<ExtArgs> | null
    /**
     * Filter, which FAQ to fetch.
     */
    where: FAQWhereUniqueInput
  }

  /**
   * FAQ findFirst
   */
  export type FAQFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FAQ
     */
    select?: FAQSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FAQ
     */
    omit?: FAQOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FAQInclude<ExtArgs> | null
    /**
     * Filter, which FAQ to fetch.
     */
    where?: FAQWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FAQS to fetch.
     */
    orderBy?: FAQOrderByWithRelationInput | FAQOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FAQS.
     */
    cursor?: FAQWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FAQS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FAQS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FAQS.
     */
    distinct?: FAQScalarFieldEnum | FAQScalarFieldEnum[]
  }

  /**
   * FAQ findFirstOrThrow
   */
  export type FAQFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FAQ
     */
    select?: FAQSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FAQ
     */
    omit?: FAQOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FAQInclude<ExtArgs> | null
    /**
     * Filter, which FAQ to fetch.
     */
    where?: FAQWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FAQS to fetch.
     */
    orderBy?: FAQOrderByWithRelationInput | FAQOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FAQS.
     */
    cursor?: FAQWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FAQS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FAQS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FAQS.
     */
    distinct?: FAQScalarFieldEnum | FAQScalarFieldEnum[]
  }

  /**
   * FAQ findMany
   */
  export type FAQFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FAQ
     */
    select?: FAQSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FAQ
     */
    omit?: FAQOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FAQInclude<ExtArgs> | null
    /**
     * Filter, which FAQS to fetch.
     */
    where?: FAQWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FAQS to fetch.
     */
    orderBy?: FAQOrderByWithRelationInput | FAQOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FAQS.
     */
    cursor?: FAQWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FAQS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FAQS.
     */
    skip?: number
    distinct?: FAQScalarFieldEnum | FAQScalarFieldEnum[]
  }

  /**
   * FAQ create
   */
  export type FAQCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FAQ
     */
    select?: FAQSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FAQ
     */
    omit?: FAQOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FAQInclude<ExtArgs> | null
    /**
     * The data needed to create a FAQ.
     */
    data: XOR<FAQCreateInput, FAQUncheckedCreateInput>
  }

  /**
   * FAQ createMany
   */
  export type FAQCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FAQS.
     */
    data: FAQCreateManyInput | FAQCreateManyInput[]
  }

  /**
   * FAQ createManyAndReturn
   */
  export type FAQCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FAQ
     */
    select?: FAQSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FAQ
     */
    omit?: FAQOmit<ExtArgs> | null
    /**
     * The data used to create many FAQS.
     */
    data: FAQCreateManyInput | FAQCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FAQIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * FAQ update
   */
  export type FAQUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FAQ
     */
    select?: FAQSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FAQ
     */
    omit?: FAQOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FAQInclude<ExtArgs> | null
    /**
     * The data needed to update a FAQ.
     */
    data: XOR<FAQUpdateInput, FAQUncheckedUpdateInput>
    /**
     * Choose, which FAQ to update.
     */
    where: FAQWhereUniqueInput
  }

  /**
   * FAQ updateMany
   */
  export type FAQUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FAQS.
     */
    data: XOR<FAQUpdateManyMutationInput, FAQUncheckedUpdateManyInput>
    /**
     * Filter which FAQS to update
     */
    where?: FAQWhereInput
    /**
     * Limit how many FAQS to update.
     */
    limit?: number
  }

  /**
   * FAQ updateManyAndReturn
   */
  export type FAQUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FAQ
     */
    select?: FAQSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FAQ
     */
    omit?: FAQOmit<ExtArgs> | null
    /**
     * The data used to update FAQS.
     */
    data: XOR<FAQUpdateManyMutationInput, FAQUncheckedUpdateManyInput>
    /**
     * Filter which FAQS to update
     */
    where?: FAQWhereInput
    /**
     * Limit how many FAQS to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FAQIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * FAQ upsert
   */
  export type FAQUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FAQ
     */
    select?: FAQSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FAQ
     */
    omit?: FAQOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FAQInclude<ExtArgs> | null
    /**
     * The filter to search for the FAQ to update in case it exists.
     */
    where: FAQWhereUniqueInput
    /**
     * In case the FAQ found by the `where` argument doesn't exist, create a new FAQ with this data.
     */
    create: XOR<FAQCreateInput, FAQUncheckedCreateInput>
    /**
     * In case the FAQ was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FAQUpdateInput, FAQUncheckedUpdateInput>
  }

  /**
   * FAQ delete
   */
  export type FAQDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FAQ
     */
    select?: FAQSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FAQ
     */
    omit?: FAQOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FAQInclude<ExtArgs> | null
    /**
     * Filter which FAQ to delete.
     */
    where: FAQWhereUniqueInput
  }

  /**
   * FAQ deleteMany
   */
  export type FAQDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FAQS to delete
     */
    where?: FAQWhereInput
    /**
     * Limit how many FAQS to delete.
     */
    limit?: number
  }

  /**
   * FAQ.feedback
   */
  export type FAQ$feedbackArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FAQFeedback
     */
    select?: FAQFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FAQFeedback
     */
    omit?: FAQFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FAQFeedbackInclude<ExtArgs> | null
    where?: FAQFeedbackWhereInput
    orderBy?: FAQFeedbackOrderByWithRelationInput | FAQFeedbackOrderByWithRelationInput[]
    cursor?: FAQFeedbackWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FAQFeedbackScalarFieldEnum | FAQFeedbackScalarFieldEnum[]
  }

  /**
   * FAQ without action
   */
  export type FAQDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FAQ
     */
    select?: FAQSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FAQ
     */
    omit?: FAQOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FAQInclude<ExtArgs> | null
  }


  /**
   * Model FAQFeedback
   */

  export type AggregateFAQFeedback = {
    _count: FAQFeedbackCountAggregateOutputType | null
    _min: FAQFeedbackMinAggregateOutputType | null
    _max: FAQFeedbackMaxAggregateOutputType | null
  }

  export type FAQFeedbackMinAggregateOutputType = {
    id: string | null
    faqId: string | null
    userId: string | null
    isHelpful: boolean | null
    comment: string | null
    createdAt: Date | null
  }

  export type FAQFeedbackMaxAggregateOutputType = {
    id: string | null
    faqId: string | null
    userId: string | null
    isHelpful: boolean | null
    comment: string | null
    createdAt: Date | null
  }

  export type FAQFeedbackCountAggregateOutputType = {
    id: number
    faqId: number
    userId: number
    isHelpful: number
    comment: number
    createdAt: number
    _all: number
  }


  export type FAQFeedbackMinAggregateInputType = {
    id?: true
    faqId?: true
    userId?: true
    isHelpful?: true
    comment?: true
    createdAt?: true
  }

  export type FAQFeedbackMaxAggregateInputType = {
    id?: true
    faqId?: true
    userId?: true
    isHelpful?: true
    comment?: true
    createdAt?: true
  }

  export type FAQFeedbackCountAggregateInputType = {
    id?: true
    faqId?: true
    userId?: true
    isHelpful?: true
    comment?: true
    createdAt?: true
    _all?: true
  }

  export type FAQFeedbackAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FAQFeedback to aggregate.
     */
    where?: FAQFeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FAQFeedbacks to fetch.
     */
    orderBy?: FAQFeedbackOrderByWithRelationInput | FAQFeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FAQFeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FAQFeedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FAQFeedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FAQFeedbacks
    **/
    _count?: true | FAQFeedbackCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FAQFeedbackMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FAQFeedbackMaxAggregateInputType
  }

  export type GetFAQFeedbackAggregateType<T extends FAQFeedbackAggregateArgs> = {
        [P in keyof T & keyof AggregateFAQFeedback]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFAQFeedback[P]>
      : GetScalarType<T[P], AggregateFAQFeedback[P]>
  }




  export type FAQFeedbackGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FAQFeedbackWhereInput
    orderBy?: FAQFeedbackOrderByWithAggregationInput | FAQFeedbackOrderByWithAggregationInput[]
    by: FAQFeedbackScalarFieldEnum[] | FAQFeedbackScalarFieldEnum
    having?: FAQFeedbackScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FAQFeedbackCountAggregateInputType | true
    _min?: FAQFeedbackMinAggregateInputType
    _max?: FAQFeedbackMaxAggregateInputType
  }

  export type FAQFeedbackGroupByOutputType = {
    id: string
    faqId: string
    userId: string
    isHelpful: boolean
    comment: string | null
    createdAt: Date
    _count: FAQFeedbackCountAggregateOutputType | null
    _min: FAQFeedbackMinAggregateOutputType | null
    _max: FAQFeedbackMaxAggregateOutputType | null
  }

  type GetFAQFeedbackGroupByPayload<T extends FAQFeedbackGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FAQFeedbackGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FAQFeedbackGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FAQFeedbackGroupByOutputType[P]>
            : GetScalarType<T[P], FAQFeedbackGroupByOutputType[P]>
        }
      >
    >


  export type FAQFeedbackSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    faqId?: boolean
    userId?: boolean
    isHelpful?: boolean
    comment?: boolean
    createdAt?: boolean
    faq?: boolean | FAQDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fAQFeedback"]>

  export type FAQFeedbackSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    faqId?: boolean
    userId?: boolean
    isHelpful?: boolean
    comment?: boolean
    createdAt?: boolean
    faq?: boolean | FAQDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fAQFeedback"]>

  export type FAQFeedbackSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    faqId?: boolean
    userId?: boolean
    isHelpful?: boolean
    comment?: boolean
    createdAt?: boolean
    faq?: boolean | FAQDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fAQFeedback"]>

  export type FAQFeedbackSelectScalar = {
    id?: boolean
    faqId?: boolean
    userId?: boolean
    isHelpful?: boolean
    comment?: boolean
    createdAt?: boolean
  }

  export type FAQFeedbackOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "faqId" | "userId" | "isHelpful" | "comment" | "createdAt", ExtArgs["result"]["fAQFeedback"]>
  export type FAQFeedbackInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    faq?: boolean | FAQDefaultArgs<ExtArgs>
  }
  export type FAQFeedbackIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    faq?: boolean | FAQDefaultArgs<ExtArgs>
  }
  export type FAQFeedbackIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    faq?: boolean | FAQDefaultArgs<ExtArgs>
  }

  export type $FAQFeedbackPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FAQFeedback"
    objects: {
      faq: Prisma.$FAQPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      faqId: string
      userId: string
      isHelpful: boolean
      comment: string | null
      createdAt: Date
    }, ExtArgs["result"]["fAQFeedback"]>
    composites: {}
  }

  type FAQFeedbackGetPayload<S extends boolean | null | undefined | FAQFeedbackDefaultArgs> = $Result.GetResult<Prisma.$FAQFeedbackPayload, S>

  type FAQFeedbackCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FAQFeedbackFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FAQFeedbackCountAggregateInputType | true
    }

  export interface FAQFeedbackDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FAQFeedback'], meta: { name: 'FAQFeedback' } }
    /**
     * Find zero or one FAQFeedback that matches the filter.
     * @param {FAQFeedbackFindUniqueArgs} args - Arguments to find a FAQFeedback
     * @example
     * // Get one FAQFeedback
     * const fAQFeedback = await prisma.fAQFeedback.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FAQFeedbackFindUniqueArgs>(args: SelectSubset<T, FAQFeedbackFindUniqueArgs<ExtArgs>>): Prisma__FAQFeedbackClient<$Result.GetResult<Prisma.$FAQFeedbackPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FAQFeedback that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FAQFeedbackFindUniqueOrThrowArgs} args - Arguments to find a FAQFeedback
     * @example
     * // Get one FAQFeedback
     * const fAQFeedback = await prisma.fAQFeedback.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FAQFeedbackFindUniqueOrThrowArgs>(args: SelectSubset<T, FAQFeedbackFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FAQFeedbackClient<$Result.GetResult<Prisma.$FAQFeedbackPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FAQFeedback that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FAQFeedbackFindFirstArgs} args - Arguments to find a FAQFeedback
     * @example
     * // Get one FAQFeedback
     * const fAQFeedback = await prisma.fAQFeedback.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FAQFeedbackFindFirstArgs>(args?: SelectSubset<T, FAQFeedbackFindFirstArgs<ExtArgs>>): Prisma__FAQFeedbackClient<$Result.GetResult<Prisma.$FAQFeedbackPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FAQFeedback that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FAQFeedbackFindFirstOrThrowArgs} args - Arguments to find a FAQFeedback
     * @example
     * // Get one FAQFeedback
     * const fAQFeedback = await prisma.fAQFeedback.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FAQFeedbackFindFirstOrThrowArgs>(args?: SelectSubset<T, FAQFeedbackFindFirstOrThrowArgs<ExtArgs>>): Prisma__FAQFeedbackClient<$Result.GetResult<Prisma.$FAQFeedbackPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FAQFeedbacks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FAQFeedbackFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FAQFeedbacks
     * const fAQFeedbacks = await prisma.fAQFeedback.findMany()
     * 
     * // Get first 10 FAQFeedbacks
     * const fAQFeedbacks = await prisma.fAQFeedback.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fAQFeedbackWithIdOnly = await prisma.fAQFeedback.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FAQFeedbackFindManyArgs>(args?: SelectSubset<T, FAQFeedbackFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FAQFeedbackPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FAQFeedback.
     * @param {FAQFeedbackCreateArgs} args - Arguments to create a FAQFeedback.
     * @example
     * // Create one FAQFeedback
     * const FAQFeedback = await prisma.fAQFeedback.create({
     *   data: {
     *     // ... data to create a FAQFeedback
     *   }
     * })
     * 
     */
    create<T extends FAQFeedbackCreateArgs>(args: SelectSubset<T, FAQFeedbackCreateArgs<ExtArgs>>): Prisma__FAQFeedbackClient<$Result.GetResult<Prisma.$FAQFeedbackPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FAQFeedbacks.
     * @param {FAQFeedbackCreateManyArgs} args - Arguments to create many FAQFeedbacks.
     * @example
     * // Create many FAQFeedbacks
     * const fAQFeedback = await prisma.fAQFeedback.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FAQFeedbackCreateManyArgs>(args?: SelectSubset<T, FAQFeedbackCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FAQFeedbacks and returns the data saved in the database.
     * @param {FAQFeedbackCreateManyAndReturnArgs} args - Arguments to create many FAQFeedbacks.
     * @example
     * // Create many FAQFeedbacks
     * const fAQFeedback = await prisma.fAQFeedback.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FAQFeedbacks and only return the `id`
     * const fAQFeedbackWithIdOnly = await prisma.fAQFeedback.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FAQFeedbackCreateManyAndReturnArgs>(args?: SelectSubset<T, FAQFeedbackCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FAQFeedbackPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FAQFeedback.
     * @param {FAQFeedbackDeleteArgs} args - Arguments to delete one FAQFeedback.
     * @example
     * // Delete one FAQFeedback
     * const FAQFeedback = await prisma.fAQFeedback.delete({
     *   where: {
     *     // ... filter to delete one FAQFeedback
     *   }
     * })
     * 
     */
    delete<T extends FAQFeedbackDeleteArgs>(args: SelectSubset<T, FAQFeedbackDeleteArgs<ExtArgs>>): Prisma__FAQFeedbackClient<$Result.GetResult<Prisma.$FAQFeedbackPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FAQFeedback.
     * @param {FAQFeedbackUpdateArgs} args - Arguments to update one FAQFeedback.
     * @example
     * // Update one FAQFeedback
     * const fAQFeedback = await prisma.fAQFeedback.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FAQFeedbackUpdateArgs>(args: SelectSubset<T, FAQFeedbackUpdateArgs<ExtArgs>>): Prisma__FAQFeedbackClient<$Result.GetResult<Prisma.$FAQFeedbackPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FAQFeedbacks.
     * @param {FAQFeedbackDeleteManyArgs} args - Arguments to filter FAQFeedbacks to delete.
     * @example
     * // Delete a few FAQFeedbacks
     * const { count } = await prisma.fAQFeedback.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FAQFeedbackDeleteManyArgs>(args?: SelectSubset<T, FAQFeedbackDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FAQFeedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FAQFeedbackUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FAQFeedbacks
     * const fAQFeedback = await prisma.fAQFeedback.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FAQFeedbackUpdateManyArgs>(args: SelectSubset<T, FAQFeedbackUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FAQFeedbacks and returns the data updated in the database.
     * @param {FAQFeedbackUpdateManyAndReturnArgs} args - Arguments to update many FAQFeedbacks.
     * @example
     * // Update many FAQFeedbacks
     * const fAQFeedback = await prisma.fAQFeedback.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FAQFeedbacks and only return the `id`
     * const fAQFeedbackWithIdOnly = await prisma.fAQFeedback.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FAQFeedbackUpdateManyAndReturnArgs>(args: SelectSubset<T, FAQFeedbackUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FAQFeedbackPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FAQFeedback.
     * @param {FAQFeedbackUpsertArgs} args - Arguments to update or create a FAQFeedback.
     * @example
     * // Update or create a FAQFeedback
     * const fAQFeedback = await prisma.fAQFeedback.upsert({
     *   create: {
     *     // ... data to create a FAQFeedback
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FAQFeedback we want to update
     *   }
     * })
     */
    upsert<T extends FAQFeedbackUpsertArgs>(args: SelectSubset<T, FAQFeedbackUpsertArgs<ExtArgs>>): Prisma__FAQFeedbackClient<$Result.GetResult<Prisma.$FAQFeedbackPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FAQFeedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FAQFeedbackCountArgs} args - Arguments to filter FAQFeedbacks to count.
     * @example
     * // Count the number of FAQFeedbacks
     * const count = await prisma.fAQFeedback.count({
     *   where: {
     *     // ... the filter for the FAQFeedbacks we want to count
     *   }
     * })
    **/
    count<T extends FAQFeedbackCountArgs>(
      args?: Subset<T, FAQFeedbackCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FAQFeedbackCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FAQFeedback.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FAQFeedbackAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FAQFeedbackAggregateArgs>(args: Subset<T, FAQFeedbackAggregateArgs>): Prisma.PrismaPromise<GetFAQFeedbackAggregateType<T>>

    /**
     * Group by FAQFeedback.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FAQFeedbackGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FAQFeedbackGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FAQFeedbackGroupByArgs['orderBy'] }
        : { orderBy?: FAQFeedbackGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FAQFeedbackGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFAQFeedbackGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FAQFeedback model
   */
  readonly fields: FAQFeedbackFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FAQFeedback.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FAQFeedbackClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    faq<T extends FAQDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FAQDefaultArgs<ExtArgs>>): Prisma__FAQClient<$Result.GetResult<Prisma.$FAQPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FAQFeedback model
   */
  interface FAQFeedbackFieldRefs {
    readonly id: FieldRef<"FAQFeedback", 'String'>
    readonly faqId: FieldRef<"FAQFeedback", 'String'>
    readonly userId: FieldRef<"FAQFeedback", 'String'>
    readonly isHelpful: FieldRef<"FAQFeedback", 'Boolean'>
    readonly comment: FieldRef<"FAQFeedback", 'String'>
    readonly createdAt: FieldRef<"FAQFeedback", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FAQFeedback findUnique
   */
  export type FAQFeedbackFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FAQFeedback
     */
    select?: FAQFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FAQFeedback
     */
    omit?: FAQFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FAQFeedbackInclude<ExtArgs> | null
    /**
     * Filter, which FAQFeedback to fetch.
     */
    where: FAQFeedbackWhereUniqueInput
  }

  /**
   * FAQFeedback findUniqueOrThrow
   */
  export type FAQFeedbackFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FAQFeedback
     */
    select?: FAQFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FAQFeedback
     */
    omit?: FAQFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FAQFeedbackInclude<ExtArgs> | null
    /**
     * Filter, which FAQFeedback to fetch.
     */
    where: FAQFeedbackWhereUniqueInput
  }

  /**
   * FAQFeedback findFirst
   */
  export type FAQFeedbackFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FAQFeedback
     */
    select?: FAQFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FAQFeedback
     */
    omit?: FAQFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FAQFeedbackInclude<ExtArgs> | null
    /**
     * Filter, which FAQFeedback to fetch.
     */
    where?: FAQFeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FAQFeedbacks to fetch.
     */
    orderBy?: FAQFeedbackOrderByWithRelationInput | FAQFeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FAQFeedbacks.
     */
    cursor?: FAQFeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FAQFeedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FAQFeedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FAQFeedbacks.
     */
    distinct?: FAQFeedbackScalarFieldEnum | FAQFeedbackScalarFieldEnum[]
  }

  /**
   * FAQFeedback findFirstOrThrow
   */
  export type FAQFeedbackFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FAQFeedback
     */
    select?: FAQFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FAQFeedback
     */
    omit?: FAQFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FAQFeedbackInclude<ExtArgs> | null
    /**
     * Filter, which FAQFeedback to fetch.
     */
    where?: FAQFeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FAQFeedbacks to fetch.
     */
    orderBy?: FAQFeedbackOrderByWithRelationInput | FAQFeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FAQFeedbacks.
     */
    cursor?: FAQFeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FAQFeedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FAQFeedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FAQFeedbacks.
     */
    distinct?: FAQFeedbackScalarFieldEnum | FAQFeedbackScalarFieldEnum[]
  }

  /**
   * FAQFeedback findMany
   */
  export type FAQFeedbackFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FAQFeedback
     */
    select?: FAQFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FAQFeedback
     */
    omit?: FAQFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FAQFeedbackInclude<ExtArgs> | null
    /**
     * Filter, which FAQFeedbacks to fetch.
     */
    where?: FAQFeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FAQFeedbacks to fetch.
     */
    orderBy?: FAQFeedbackOrderByWithRelationInput | FAQFeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FAQFeedbacks.
     */
    cursor?: FAQFeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FAQFeedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FAQFeedbacks.
     */
    skip?: number
    distinct?: FAQFeedbackScalarFieldEnum | FAQFeedbackScalarFieldEnum[]
  }

  /**
   * FAQFeedback create
   */
  export type FAQFeedbackCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FAQFeedback
     */
    select?: FAQFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FAQFeedback
     */
    omit?: FAQFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FAQFeedbackInclude<ExtArgs> | null
    /**
     * The data needed to create a FAQFeedback.
     */
    data: XOR<FAQFeedbackCreateInput, FAQFeedbackUncheckedCreateInput>
  }

  /**
   * FAQFeedback createMany
   */
  export type FAQFeedbackCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FAQFeedbacks.
     */
    data: FAQFeedbackCreateManyInput | FAQFeedbackCreateManyInput[]
  }

  /**
   * FAQFeedback createManyAndReturn
   */
  export type FAQFeedbackCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FAQFeedback
     */
    select?: FAQFeedbackSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FAQFeedback
     */
    omit?: FAQFeedbackOmit<ExtArgs> | null
    /**
     * The data used to create many FAQFeedbacks.
     */
    data: FAQFeedbackCreateManyInput | FAQFeedbackCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FAQFeedbackIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * FAQFeedback update
   */
  export type FAQFeedbackUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FAQFeedback
     */
    select?: FAQFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FAQFeedback
     */
    omit?: FAQFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FAQFeedbackInclude<ExtArgs> | null
    /**
     * The data needed to update a FAQFeedback.
     */
    data: XOR<FAQFeedbackUpdateInput, FAQFeedbackUncheckedUpdateInput>
    /**
     * Choose, which FAQFeedback to update.
     */
    where: FAQFeedbackWhereUniqueInput
  }

  /**
   * FAQFeedback updateMany
   */
  export type FAQFeedbackUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FAQFeedbacks.
     */
    data: XOR<FAQFeedbackUpdateManyMutationInput, FAQFeedbackUncheckedUpdateManyInput>
    /**
     * Filter which FAQFeedbacks to update
     */
    where?: FAQFeedbackWhereInput
    /**
     * Limit how many FAQFeedbacks to update.
     */
    limit?: number
  }

  /**
   * FAQFeedback updateManyAndReturn
   */
  export type FAQFeedbackUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FAQFeedback
     */
    select?: FAQFeedbackSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FAQFeedback
     */
    omit?: FAQFeedbackOmit<ExtArgs> | null
    /**
     * The data used to update FAQFeedbacks.
     */
    data: XOR<FAQFeedbackUpdateManyMutationInput, FAQFeedbackUncheckedUpdateManyInput>
    /**
     * Filter which FAQFeedbacks to update
     */
    where?: FAQFeedbackWhereInput
    /**
     * Limit how many FAQFeedbacks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FAQFeedbackIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * FAQFeedback upsert
   */
  export type FAQFeedbackUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FAQFeedback
     */
    select?: FAQFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FAQFeedback
     */
    omit?: FAQFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FAQFeedbackInclude<ExtArgs> | null
    /**
     * The filter to search for the FAQFeedback to update in case it exists.
     */
    where: FAQFeedbackWhereUniqueInput
    /**
     * In case the FAQFeedback found by the `where` argument doesn't exist, create a new FAQFeedback with this data.
     */
    create: XOR<FAQFeedbackCreateInput, FAQFeedbackUncheckedCreateInput>
    /**
     * In case the FAQFeedback was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FAQFeedbackUpdateInput, FAQFeedbackUncheckedUpdateInput>
  }

  /**
   * FAQFeedback delete
   */
  export type FAQFeedbackDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FAQFeedback
     */
    select?: FAQFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FAQFeedback
     */
    omit?: FAQFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FAQFeedbackInclude<ExtArgs> | null
    /**
     * Filter which FAQFeedback to delete.
     */
    where: FAQFeedbackWhereUniqueInput
  }

  /**
   * FAQFeedback deleteMany
   */
  export type FAQFeedbackDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FAQFeedbacks to delete
     */
    where?: FAQFeedbackWhereInput
    /**
     * Limit how many FAQFeedbacks to delete.
     */
    limit?: number
  }

  /**
   * FAQFeedback without action
   */
  export type FAQFeedbackDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FAQFeedback
     */
    select?: FAQFeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FAQFeedback
     */
    omit?: FAQFeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FAQFeedbackInclude<ExtArgs> | null
  }


  /**
   * Model Expert
   */

  export type AggregateExpert = {
    _count: ExpertCountAggregateOutputType | null
    _avg: ExpertAvgAggregateOutputType | null
    _sum: ExpertSumAggregateOutputType | null
    _min: ExpertMinAggregateOutputType | null
    _max: ExpertMaxAggregateOutputType | null
  }

  export type ExpertAvgAggregateOutputType = {
    rating: number | null
    reviewCount: number | null
  }

  export type ExpertSumAggregateOutputType = {
    rating: number | null
    reviewCount: number | null
  }

  export type ExpertMinAggregateOutputType = {
    id: string | null
    userId: string | null
    bio: string | null
    specialties: string | null
    certifications: string | null
    experience: string | null
    contactInfo: string | null
    rating: number | null
    reviewCount: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ExpertMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    bio: string | null
    specialties: string | null
    certifications: string | null
    experience: string | null
    contactInfo: string | null
    rating: number | null
    reviewCount: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ExpertCountAggregateOutputType = {
    id: number
    userId: number
    bio: number
    specialties: number
    certifications: number
    experience: number
    contactInfo: number
    rating: number
    reviewCount: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ExpertAvgAggregateInputType = {
    rating?: true
    reviewCount?: true
  }

  export type ExpertSumAggregateInputType = {
    rating?: true
    reviewCount?: true
  }

  export type ExpertMinAggregateInputType = {
    id?: true
    userId?: true
    bio?: true
    specialties?: true
    certifications?: true
    experience?: true
    contactInfo?: true
    rating?: true
    reviewCount?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ExpertMaxAggregateInputType = {
    id?: true
    userId?: true
    bio?: true
    specialties?: true
    certifications?: true
    experience?: true
    contactInfo?: true
    rating?: true
    reviewCount?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ExpertCountAggregateInputType = {
    id?: true
    userId?: true
    bio?: true
    specialties?: true
    certifications?: true
    experience?: true
    contactInfo?: true
    rating?: true
    reviewCount?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ExpertAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Expert to aggregate.
     */
    where?: ExpertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Experts to fetch.
     */
    orderBy?: ExpertOrderByWithRelationInput | ExpertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExpertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Experts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Experts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Experts
    **/
    _count?: true | ExpertCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExpertAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExpertSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExpertMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExpertMaxAggregateInputType
  }

  export type GetExpertAggregateType<T extends ExpertAggregateArgs> = {
        [P in keyof T & keyof AggregateExpert]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExpert[P]>
      : GetScalarType<T[P], AggregateExpert[P]>
  }




  export type ExpertGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExpertWhereInput
    orderBy?: ExpertOrderByWithAggregationInput | ExpertOrderByWithAggregationInput[]
    by: ExpertScalarFieldEnum[] | ExpertScalarFieldEnum
    having?: ExpertScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExpertCountAggregateInputType | true
    _avg?: ExpertAvgAggregateInputType
    _sum?: ExpertSumAggregateInputType
    _min?: ExpertMinAggregateInputType
    _max?: ExpertMaxAggregateInputType
  }

  export type ExpertGroupByOutputType = {
    id: string
    userId: string
    bio: string | null
    specialties: string
    certifications: string | null
    experience: string | null
    contactInfo: string | null
    rating: number
    reviewCount: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: ExpertCountAggregateOutputType | null
    _avg: ExpertAvgAggregateOutputType | null
    _sum: ExpertSumAggregateOutputType | null
    _min: ExpertMinAggregateOutputType | null
    _max: ExpertMaxAggregateOutputType | null
  }

  type GetExpertGroupByPayload<T extends ExpertGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExpertGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExpertGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExpertGroupByOutputType[P]>
            : GetScalarType<T[P], ExpertGroupByOutputType[P]>
        }
      >
    >


  export type ExpertSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    bio?: boolean
    specialties?: boolean
    certifications?: boolean
    experience?: boolean
    contactInfo?: boolean
    rating?: boolean
    reviewCount?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    reviews?: boolean | Expert$reviewsArgs<ExtArgs>
    _count?: boolean | ExpertCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["expert"]>

  export type ExpertSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    bio?: boolean
    specialties?: boolean
    certifications?: boolean
    experience?: boolean
    contactInfo?: boolean
    rating?: boolean
    reviewCount?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["expert"]>

  export type ExpertSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    bio?: boolean
    specialties?: boolean
    certifications?: boolean
    experience?: boolean
    contactInfo?: boolean
    rating?: boolean
    reviewCount?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["expert"]>

  export type ExpertSelectScalar = {
    id?: boolean
    userId?: boolean
    bio?: boolean
    specialties?: boolean
    certifications?: boolean
    experience?: boolean
    contactInfo?: boolean
    rating?: boolean
    reviewCount?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ExpertOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "bio" | "specialties" | "certifications" | "experience" | "contactInfo" | "rating" | "reviewCount" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["expert"]>
  export type ExpertInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reviews?: boolean | Expert$reviewsArgs<ExtArgs>
    _count?: boolean | ExpertCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ExpertIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ExpertIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ExpertPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Expert"
    objects: {
      reviews: Prisma.$ExpertReviewPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      bio: string | null
      specialties: string
      certifications: string | null
      experience: string | null
      contactInfo: string | null
      rating: number
      reviewCount: number
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["expert"]>
    composites: {}
  }

  type ExpertGetPayload<S extends boolean | null | undefined | ExpertDefaultArgs> = $Result.GetResult<Prisma.$ExpertPayload, S>

  type ExpertCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExpertFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExpertCountAggregateInputType | true
    }

  export interface ExpertDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Expert'], meta: { name: 'Expert' } }
    /**
     * Find zero or one Expert that matches the filter.
     * @param {ExpertFindUniqueArgs} args - Arguments to find a Expert
     * @example
     * // Get one Expert
     * const expert = await prisma.expert.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExpertFindUniqueArgs>(args: SelectSubset<T, ExpertFindUniqueArgs<ExtArgs>>): Prisma__ExpertClient<$Result.GetResult<Prisma.$ExpertPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Expert that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExpertFindUniqueOrThrowArgs} args - Arguments to find a Expert
     * @example
     * // Get one Expert
     * const expert = await prisma.expert.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExpertFindUniqueOrThrowArgs>(args: SelectSubset<T, ExpertFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExpertClient<$Result.GetResult<Prisma.$ExpertPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Expert that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpertFindFirstArgs} args - Arguments to find a Expert
     * @example
     * // Get one Expert
     * const expert = await prisma.expert.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExpertFindFirstArgs>(args?: SelectSubset<T, ExpertFindFirstArgs<ExtArgs>>): Prisma__ExpertClient<$Result.GetResult<Prisma.$ExpertPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Expert that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpertFindFirstOrThrowArgs} args - Arguments to find a Expert
     * @example
     * // Get one Expert
     * const expert = await prisma.expert.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExpertFindFirstOrThrowArgs>(args?: SelectSubset<T, ExpertFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExpertClient<$Result.GetResult<Prisma.$ExpertPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Experts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpertFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Experts
     * const experts = await prisma.expert.findMany()
     * 
     * // Get first 10 Experts
     * const experts = await prisma.expert.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const expertWithIdOnly = await prisma.expert.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExpertFindManyArgs>(args?: SelectSubset<T, ExpertFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExpertPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Expert.
     * @param {ExpertCreateArgs} args - Arguments to create a Expert.
     * @example
     * // Create one Expert
     * const Expert = await prisma.expert.create({
     *   data: {
     *     // ... data to create a Expert
     *   }
     * })
     * 
     */
    create<T extends ExpertCreateArgs>(args: SelectSubset<T, ExpertCreateArgs<ExtArgs>>): Prisma__ExpertClient<$Result.GetResult<Prisma.$ExpertPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Experts.
     * @param {ExpertCreateManyArgs} args - Arguments to create many Experts.
     * @example
     * // Create many Experts
     * const expert = await prisma.expert.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExpertCreateManyArgs>(args?: SelectSubset<T, ExpertCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Experts and returns the data saved in the database.
     * @param {ExpertCreateManyAndReturnArgs} args - Arguments to create many Experts.
     * @example
     * // Create many Experts
     * const expert = await prisma.expert.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Experts and only return the `id`
     * const expertWithIdOnly = await prisma.expert.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExpertCreateManyAndReturnArgs>(args?: SelectSubset<T, ExpertCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExpertPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Expert.
     * @param {ExpertDeleteArgs} args - Arguments to delete one Expert.
     * @example
     * // Delete one Expert
     * const Expert = await prisma.expert.delete({
     *   where: {
     *     // ... filter to delete one Expert
     *   }
     * })
     * 
     */
    delete<T extends ExpertDeleteArgs>(args: SelectSubset<T, ExpertDeleteArgs<ExtArgs>>): Prisma__ExpertClient<$Result.GetResult<Prisma.$ExpertPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Expert.
     * @param {ExpertUpdateArgs} args - Arguments to update one Expert.
     * @example
     * // Update one Expert
     * const expert = await prisma.expert.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExpertUpdateArgs>(args: SelectSubset<T, ExpertUpdateArgs<ExtArgs>>): Prisma__ExpertClient<$Result.GetResult<Prisma.$ExpertPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Experts.
     * @param {ExpertDeleteManyArgs} args - Arguments to filter Experts to delete.
     * @example
     * // Delete a few Experts
     * const { count } = await prisma.expert.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExpertDeleteManyArgs>(args?: SelectSubset<T, ExpertDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Experts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpertUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Experts
     * const expert = await prisma.expert.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExpertUpdateManyArgs>(args: SelectSubset<T, ExpertUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Experts and returns the data updated in the database.
     * @param {ExpertUpdateManyAndReturnArgs} args - Arguments to update many Experts.
     * @example
     * // Update many Experts
     * const expert = await prisma.expert.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Experts and only return the `id`
     * const expertWithIdOnly = await prisma.expert.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ExpertUpdateManyAndReturnArgs>(args: SelectSubset<T, ExpertUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExpertPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Expert.
     * @param {ExpertUpsertArgs} args - Arguments to update or create a Expert.
     * @example
     * // Update or create a Expert
     * const expert = await prisma.expert.upsert({
     *   create: {
     *     // ... data to create a Expert
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Expert we want to update
     *   }
     * })
     */
    upsert<T extends ExpertUpsertArgs>(args: SelectSubset<T, ExpertUpsertArgs<ExtArgs>>): Prisma__ExpertClient<$Result.GetResult<Prisma.$ExpertPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Experts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpertCountArgs} args - Arguments to filter Experts to count.
     * @example
     * // Count the number of Experts
     * const count = await prisma.expert.count({
     *   where: {
     *     // ... the filter for the Experts we want to count
     *   }
     * })
    **/
    count<T extends ExpertCountArgs>(
      args?: Subset<T, ExpertCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExpertCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Expert.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpertAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExpertAggregateArgs>(args: Subset<T, ExpertAggregateArgs>): Prisma.PrismaPromise<GetExpertAggregateType<T>>

    /**
     * Group by Expert.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpertGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExpertGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExpertGroupByArgs['orderBy'] }
        : { orderBy?: ExpertGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExpertGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExpertGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Expert model
   */
  readonly fields: ExpertFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Expert.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExpertClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    reviews<T extends Expert$reviewsArgs<ExtArgs> = {}>(args?: Subset<T, Expert$reviewsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExpertReviewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Expert model
   */
  interface ExpertFieldRefs {
    readonly id: FieldRef<"Expert", 'String'>
    readonly userId: FieldRef<"Expert", 'String'>
    readonly bio: FieldRef<"Expert", 'String'>
    readonly specialties: FieldRef<"Expert", 'String'>
    readonly certifications: FieldRef<"Expert", 'String'>
    readonly experience: FieldRef<"Expert", 'String'>
    readonly contactInfo: FieldRef<"Expert", 'String'>
    readonly rating: FieldRef<"Expert", 'Float'>
    readonly reviewCount: FieldRef<"Expert", 'Int'>
    readonly isActive: FieldRef<"Expert", 'Boolean'>
    readonly createdAt: FieldRef<"Expert", 'DateTime'>
    readonly updatedAt: FieldRef<"Expert", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Expert findUnique
   */
  export type ExpertFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Expert
     */
    select?: ExpertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Expert
     */
    omit?: ExpertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpertInclude<ExtArgs> | null
    /**
     * Filter, which Expert to fetch.
     */
    where: ExpertWhereUniqueInput
  }

  /**
   * Expert findUniqueOrThrow
   */
  export type ExpertFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Expert
     */
    select?: ExpertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Expert
     */
    omit?: ExpertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpertInclude<ExtArgs> | null
    /**
     * Filter, which Expert to fetch.
     */
    where: ExpertWhereUniqueInput
  }

  /**
   * Expert findFirst
   */
  export type ExpertFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Expert
     */
    select?: ExpertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Expert
     */
    omit?: ExpertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpertInclude<ExtArgs> | null
    /**
     * Filter, which Expert to fetch.
     */
    where?: ExpertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Experts to fetch.
     */
    orderBy?: ExpertOrderByWithRelationInput | ExpertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Experts.
     */
    cursor?: ExpertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Experts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Experts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Experts.
     */
    distinct?: ExpertScalarFieldEnum | ExpertScalarFieldEnum[]
  }

  /**
   * Expert findFirstOrThrow
   */
  export type ExpertFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Expert
     */
    select?: ExpertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Expert
     */
    omit?: ExpertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpertInclude<ExtArgs> | null
    /**
     * Filter, which Expert to fetch.
     */
    where?: ExpertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Experts to fetch.
     */
    orderBy?: ExpertOrderByWithRelationInput | ExpertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Experts.
     */
    cursor?: ExpertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Experts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Experts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Experts.
     */
    distinct?: ExpertScalarFieldEnum | ExpertScalarFieldEnum[]
  }

  /**
   * Expert findMany
   */
  export type ExpertFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Expert
     */
    select?: ExpertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Expert
     */
    omit?: ExpertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpertInclude<ExtArgs> | null
    /**
     * Filter, which Experts to fetch.
     */
    where?: ExpertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Experts to fetch.
     */
    orderBy?: ExpertOrderByWithRelationInput | ExpertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Experts.
     */
    cursor?: ExpertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Experts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Experts.
     */
    skip?: number
    distinct?: ExpertScalarFieldEnum | ExpertScalarFieldEnum[]
  }

  /**
   * Expert create
   */
  export type ExpertCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Expert
     */
    select?: ExpertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Expert
     */
    omit?: ExpertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpertInclude<ExtArgs> | null
    /**
     * The data needed to create a Expert.
     */
    data: XOR<ExpertCreateInput, ExpertUncheckedCreateInput>
  }

  /**
   * Expert createMany
   */
  export type ExpertCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Experts.
     */
    data: ExpertCreateManyInput | ExpertCreateManyInput[]
  }

  /**
   * Expert createManyAndReturn
   */
  export type ExpertCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Expert
     */
    select?: ExpertSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Expert
     */
    omit?: ExpertOmit<ExtArgs> | null
    /**
     * The data used to create many Experts.
     */
    data: ExpertCreateManyInput | ExpertCreateManyInput[]
  }

  /**
   * Expert update
   */
  export type ExpertUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Expert
     */
    select?: ExpertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Expert
     */
    omit?: ExpertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpertInclude<ExtArgs> | null
    /**
     * The data needed to update a Expert.
     */
    data: XOR<ExpertUpdateInput, ExpertUncheckedUpdateInput>
    /**
     * Choose, which Expert to update.
     */
    where: ExpertWhereUniqueInput
  }

  /**
   * Expert updateMany
   */
  export type ExpertUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Experts.
     */
    data: XOR<ExpertUpdateManyMutationInput, ExpertUncheckedUpdateManyInput>
    /**
     * Filter which Experts to update
     */
    where?: ExpertWhereInput
    /**
     * Limit how many Experts to update.
     */
    limit?: number
  }

  /**
   * Expert updateManyAndReturn
   */
  export type ExpertUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Expert
     */
    select?: ExpertSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Expert
     */
    omit?: ExpertOmit<ExtArgs> | null
    /**
     * The data used to update Experts.
     */
    data: XOR<ExpertUpdateManyMutationInput, ExpertUncheckedUpdateManyInput>
    /**
     * Filter which Experts to update
     */
    where?: ExpertWhereInput
    /**
     * Limit how many Experts to update.
     */
    limit?: number
  }

  /**
   * Expert upsert
   */
  export type ExpertUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Expert
     */
    select?: ExpertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Expert
     */
    omit?: ExpertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpertInclude<ExtArgs> | null
    /**
     * The filter to search for the Expert to update in case it exists.
     */
    where: ExpertWhereUniqueInput
    /**
     * In case the Expert found by the `where` argument doesn't exist, create a new Expert with this data.
     */
    create: XOR<ExpertCreateInput, ExpertUncheckedCreateInput>
    /**
     * In case the Expert was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExpertUpdateInput, ExpertUncheckedUpdateInput>
  }

  /**
   * Expert delete
   */
  export type ExpertDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Expert
     */
    select?: ExpertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Expert
     */
    omit?: ExpertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpertInclude<ExtArgs> | null
    /**
     * Filter which Expert to delete.
     */
    where: ExpertWhereUniqueInput
  }

  /**
   * Expert deleteMany
   */
  export type ExpertDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Experts to delete
     */
    where?: ExpertWhereInput
    /**
     * Limit how many Experts to delete.
     */
    limit?: number
  }

  /**
   * Expert.reviews
   */
  export type Expert$reviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpertReview
     */
    select?: ExpertReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpertReview
     */
    omit?: ExpertReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpertReviewInclude<ExtArgs> | null
    where?: ExpertReviewWhereInput
    orderBy?: ExpertReviewOrderByWithRelationInput | ExpertReviewOrderByWithRelationInput[]
    cursor?: ExpertReviewWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExpertReviewScalarFieldEnum | ExpertReviewScalarFieldEnum[]
  }

  /**
   * Expert without action
   */
  export type ExpertDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Expert
     */
    select?: ExpertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Expert
     */
    omit?: ExpertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpertInclude<ExtArgs> | null
  }


  /**
   * Model ExpertReview
   */

  export type AggregateExpertReview = {
    _count: ExpertReviewCountAggregateOutputType | null
    _avg: ExpertReviewAvgAggregateOutputType | null
    _sum: ExpertReviewSumAggregateOutputType | null
    _min: ExpertReviewMinAggregateOutputType | null
    _max: ExpertReviewMaxAggregateOutputType | null
  }

  export type ExpertReviewAvgAggregateOutputType = {
    rating: number | null
  }

  export type ExpertReviewSumAggregateOutputType = {
    rating: number | null
  }

  export type ExpertReviewMinAggregateOutputType = {
    id: string | null
    expertId: string | null
    reviewerId: string | null
    rating: number | null
    comment: string | null
    createdAt: Date | null
  }

  export type ExpertReviewMaxAggregateOutputType = {
    id: string | null
    expertId: string | null
    reviewerId: string | null
    rating: number | null
    comment: string | null
    createdAt: Date | null
  }

  export type ExpertReviewCountAggregateOutputType = {
    id: number
    expertId: number
    reviewerId: number
    rating: number
    comment: number
    createdAt: number
    _all: number
  }


  export type ExpertReviewAvgAggregateInputType = {
    rating?: true
  }

  export type ExpertReviewSumAggregateInputType = {
    rating?: true
  }

  export type ExpertReviewMinAggregateInputType = {
    id?: true
    expertId?: true
    reviewerId?: true
    rating?: true
    comment?: true
    createdAt?: true
  }

  export type ExpertReviewMaxAggregateInputType = {
    id?: true
    expertId?: true
    reviewerId?: true
    rating?: true
    comment?: true
    createdAt?: true
  }

  export type ExpertReviewCountAggregateInputType = {
    id?: true
    expertId?: true
    reviewerId?: true
    rating?: true
    comment?: true
    createdAt?: true
    _all?: true
  }

  export type ExpertReviewAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExpertReview to aggregate.
     */
    where?: ExpertReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExpertReviews to fetch.
     */
    orderBy?: ExpertReviewOrderByWithRelationInput | ExpertReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExpertReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExpertReviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExpertReviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ExpertReviews
    **/
    _count?: true | ExpertReviewCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExpertReviewAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExpertReviewSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExpertReviewMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExpertReviewMaxAggregateInputType
  }

  export type GetExpertReviewAggregateType<T extends ExpertReviewAggregateArgs> = {
        [P in keyof T & keyof AggregateExpertReview]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExpertReview[P]>
      : GetScalarType<T[P], AggregateExpertReview[P]>
  }




  export type ExpertReviewGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExpertReviewWhereInput
    orderBy?: ExpertReviewOrderByWithAggregationInput | ExpertReviewOrderByWithAggregationInput[]
    by: ExpertReviewScalarFieldEnum[] | ExpertReviewScalarFieldEnum
    having?: ExpertReviewScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExpertReviewCountAggregateInputType | true
    _avg?: ExpertReviewAvgAggregateInputType
    _sum?: ExpertReviewSumAggregateInputType
    _min?: ExpertReviewMinAggregateInputType
    _max?: ExpertReviewMaxAggregateInputType
  }

  export type ExpertReviewGroupByOutputType = {
    id: string
    expertId: string
    reviewerId: string
    rating: number
    comment: string | null
    createdAt: Date
    _count: ExpertReviewCountAggregateOutputType | null
    _avg: ExpertReviewAvgAggregateOutputType | null
    _sum: ExpertReviewSumAggregateOutputType | null
    _min: ExpertReviewMinAggregateOutputType | null
    _max: ExpertReviewMaxAggregateOutputType | null
  }

  type GetExpertReviewGroupByPayload<T extends ExpertReviewGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExpertReviewGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExpertReviewGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExpertReviewGroupByOutputType[P]>
            : GetScalarType<T[P], ExpertReviewGroupByOutputType[P]>
        }
      >
    >


  export type ExpertReviewSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    expertId?: boolean
    reviewerId?: boolean
    rating?: boolean
    comment?: boolean
    createdAt?: boolean
    expert?: boolean | ExpertDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["expertReview"]>

  export type ExpertReviewSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    expertId?: boolean
    reviewerId?: boolean
    rating?: boolean
    comment?: boolean
    createdAt?: boolean
    expert?: boolean | ExpertDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["expertReview"]>

  export type ExpertReviewSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    expertId?: boolean
    reviewerId?: boolean
    rating?: boolean
    comment?: boolean
    createdAt?: boolean
    expert?: boolean | ExpertDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["expertReview"]>

  export type ExpertReviewSelectScalar = {
    id?: boolean
    expertId?: boolean
    reviewerId?: boolean
    rating?: boolean
    comment?: boolean
    createdAt?: boolean
  }

  export type ExpertReviewOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "expertId" | "reviewerId" | "rating" | "comment" | "createdAt", ExtArgs["result"]["expertReview"]>
  export type ExpertReviewInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    expert?: boolean | ExpertDefaultArgs<ExtArgs>
  }
  export type ExpertReviewIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    expert?: boolean | ExpertDefaultArgs<ExtArgs>
  }
  export type ExpertReviewIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    expert?: boolean | ExpertDefaultArgs<ExtArgs>
  }

  export type $ExpertReviewPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ExpertReview"
    objects: {
      expert: Prisma.$ExpertPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      expertId: string
      reviewerId: string
      rating: number
      comment: string | null
      createdAt: Date
    }, ExtArgs["result"]["expertReview"]>
    composites: {}
  }

  type ExpertReviewGetPayload<S extends boolean | null | undefined | ExpertReviewDefaultArgs> = $Result.GetResult<Prisma.$ExpertReviewPayload, S>

  type ExpertReviewCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExpertReviewFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExpertReviewCountAggregateInputType | true
    }

  export interface ExpertReviewDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ExpertReview'], meta: { name: 'ExpertReview' } }
    /**
     * Find zero or one ExpertReview that matches the filter.
     * @param {ExpertReviewFindUniqueArgs} args - Arguments to find a ExpertReview
     * @example
     * // Get one ExpertReview
     * const expertReview = await prisma.expertReview.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExpertReviewFindUniqueArgs>(args: SelectSubset<T, ExpertReviewFindUniqueArgs<ExtArgs>>): Prisma__ExpertReviewClient<$Result.GetResult<Prisma.$ExpertReviewPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ExpertReview that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExpertReviewFindUniqueOrThrowArgs} args - Arguments to find a ExpertReview
     * @example
     * // Get one ExpertReview
     * const expertReview = await prisma.expertReview.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExpertReviewFindUniqueOrThrowArgs>(args: SelectSubset<T, ExpertReviewFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExpertReviewClient<$Result.GetResult<Prisma.$ExpertReviewPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExpertReview that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpertReviewFindFirstArgs} args - Arguments to find a ExpertReview
     * @example
     * // Get one ExpertReview
     * const expertReview = await prisma.expertReview.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExpertReviewFindFirstArgs>(args?: SelectSubset<T, ExpertReviewFindFirstArgs<ExtArgs>>): Prisma__ExpertReviewClient<$Result.GetResult<Prisma.$ExpertReviewPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExpertReview that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpertReviewFindFirstOrThrowArgs} args - Arguments to find a ExpertReview
     * @example
     * // Get one ExpertReview
     * const expertReview = await prisma.expertReview.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExpertReviewFindFirstOrThrowArgs>(args?: SelectSubset<T, ExpertReviewFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExpertReviewClient<$Result.GetResult<Prisma.$ExpertReviewPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ExpertReviews that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpertReviewFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ExpertReviews
     * const expertReviews = await prisma.expertReview.findMany()
     * 
     * // Get first 10 ExpertReviews
     * const expertReviews = await prisma.expertReview.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const expertReviewWithIdOnly = await prisma.expertReview.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExpertReviewFindManyArgs>(args?: SelectSubset<T, ExpertReviewFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExpertReviewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ExpertReview.
     * @param {ExpertReviewCreateArgs} args - Arguments to create a ExpertReview.
     * @example
     * // Create one ExpertReview
     * const ExpertReview = await prisma.expertReview.create({
     *   data: {
     *     // ... data to create a ExpertReview
     *   }
     * })
     * 
     */
    create<T extends ExpertReviewCreateArgs>(args: SelectSubset<T, ExpertReviewCreateArgs<ExtArgs>>): Prisma__ExpertReviewClient<$Result.GetResult<Prisma.$ExpertReviewPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ExpertReviews.
     * @param {ExpertReviewCreateManyArgs} args - Arguments to create many ExpertReviews.
     * @example
     * // Create many ExpertReviews
     * const expertReview = await prisma.expertReview.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExpertReviewCreateManyArgs>(args?: SelectSubset<T, ExpertReviewCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ExpertReviews and returns the data saved in the database.
     * @param {ExpertReviewCreateManyAndReturnArgs} args - Arguments to create many ExpertReviews.
     * @example
     * // Create many ExpertReviews
     * const expertReview = await prisma.expertReview.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ExpertReviews and only return the `id`
     * const expertReviewWithIdOnly = await prisma.expertReview.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExpertReviewCreateManyAndReturnArgs>(args?: SelectSubset<T, ExpertReviewCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExpertReviewPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ExpertReview.
     * @param {ExpertReviewDeleteArgs} args - Arguments to delete one ExpertReview.
     * @example
     * // Delete one ExpertReview
     * const ExpertReview = await prisma.expertReview.delete({
     *   where: {
     *     // ... filter to delete one ExpertReview
     *   }
     * })
     * 
     */
    delete<T extends ExpertReviewDeleteArgs>(args: SelectSubset<T, ExpertReviewDeleteArgs<ExtArgs>>): Prisma__ExpertReviewClient<$Result.GetResult<Prisma.$ExpertReviewPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ExpertReview.
     * @param {ExpertReviewUpdateArgs} args - Arguments to update one ExpertReview.
     * @example
     * // Update one ExpertReview
     * const expertReview = await prisma.expertReview.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExpertReviewUpdateArgs>(args: SelectSubset<T, ExpertReviewUpdateArgs<ExtArgs>>): Prisma__ExpertReviewClient<$Result.GetResult<Prisma.$ExpertReviewPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ExpertReviews.
     * @param {ExpertReviewDeleteManyArgs} args - Arguments to filter ExpertReviews to delete.
     * @example
     * // Delete a few ExpertReviews
     * const { count } = await prisma.expertReview.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExpertReviewDeleteManyArgs>(args?: SelectSubset<T, ExpertReviewDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExpertReviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpertReviewUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ExpertReviews
     * const expertReview = await prisma.expertReview.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExpertReviewUpdateManyArgs>(args: SelectSubset<T, ExpertReviewUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExpertReviews and returns the data updated in the database.
     * @param {ExpertReviewUpdateManyAndReturnArgs} args - Arguments to update many ExpertReviews.
     * @example
     * // Update many ExpertReviews
     * const expertReview = await prisma.expertReview.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ExpertReviews and only return the `id`
     * const expertReviewWithIdOnly = await prisma.expertReview.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ExpertReviewUpdateManyAndReturnArgs>(args: SelectSubset<T, ExpertReviewUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExpertReviewPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ExpertReview.
     * @param {ExpertReviewUpsertArgs} args - Arguments to update or create a ExpertReview.
     * @example
     * // Update or create a ExpertReview
     * const expertReview = await prisma.expertReview.upsert({
     *   create: {
     *     // ... data to create a ExpertReview
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ExpertReview we want to update
     *   }
     * })
     */
    upsert<T extends ExpertReviewUpsertArgs>(args: SelectSubset<T, ExpertReviewUpsertArgs<ExtArgs>>): Prisma__ExpertReviewClient<$Result.GetResult<Prisma.$ExpertReviewPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ExpertReviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpertReviewCountArgs} args - Arguments to filter ExpertReviews to count.
     * @example
     * // Count the number of ExpertReviews
     * const count = await prisma.expertReview.count({
     *   where: {
     *     // ... the filter for the ExpertReviews we want to count
     *   }
     * })
    **/
    count<T extends ExpertReviewCountArgs>(
      args?: Subset<T, ExpertReviewCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExpertReviewCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ExpertReview.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpertReviewAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExpertReviewAggregateArgs>(args: Subset<T, ExpertReviewAggregateArgs>): Prisma.PrismaPromise<GetExpertReviewAggregateType<T>>

    /**
     * Group by ExpertReview.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExpertReviewGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExpertReviewGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExpertReviewGroupByArgs['orderBy'] }
        : { orderBy?: ExpertReviewGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExpertReviewGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExpertReviewGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ExpertReview model
   */
  readonly fields: ExpertReviewFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ExpertReview.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExpertReviewClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    expert<T extends ExpertDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ExpertDefaultArgs<ExtArgs>>): Prisma__ExpertClient<$Result.GetResult<Prisma.$ExpertPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ExpertReview model
   */
  interface ExpertReviewFieldRefs {
    readonly id: FieldRef<"ExpertReview", 'String'>
    readonly expertId: FieldRef<"ExpertReview", 'String'>
    readonly reviewerId: FieldRef<"ExpertReview", 'String'>
    readonly rating: FieldRef<"ExpertReview", 'Int'>
    readonly comment: FieldRef<"ExpertReview", 'String'>
    readonly createdAt: FieldRef<"ExpertReview", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ExpertReview findUnique
   */
  export type ExpertReviewFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpertReview
     */
    select?: ExpertReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpertReview
     */
    omit?: ExpertReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpertReviewInclude<ExtArgs> | null
    /**
     * Filter, which ExpertReview to fetch.
     */
    where: ExpertReviewWhereUniqueInput
  }

  /**
   * ExpertReview findUniqueOrThrow
   */
  export type ExpertReviewFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpertReview
     */
    select?: ExpertReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpertReview
     */
    omit?: ExpertReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpertReviewInclude<ExtArgs> | null
    /**
     * Filter, which ExpertReview to fetch.
     */
    where: ExpertReviewWhereUniqueInput
  }

  /**
   * ExpertReview findFirst
   */
  export type ExpertReviewFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpertReview
     */
    select?: ExpertReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpertReview
     */
    omit?: ExpertReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpertReviewInclude<ExtArgs> | null
    /**
     * Filter, which ExpertReview to fetch.
     */
    where?: ExpertReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExpertReviews to fetch.
     */
    orderBy?: ExpertReviewOrderByWithRelationInput | ExpertReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExpertReviews.
     */
    cursor?: ExpertReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExpertReviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExpertReviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExpertReviews.
     */
    distinct?: ExpertReviewScalarFieldEnum | ExpertReviewScalarFieldEnum[]
  }

  /**
   * ExpertReview findFirstOrThrow
   */
  export type ExpertReviewFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpertReview
     */
    select?: ExpertReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpertReview
     */
    omit?: ExpertReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpertReviewInclude<ExtArgs> | null
    /**
     * Filter, which ExpertReview to fetch.
     */
    where?: ExpertReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExpertReviews to fetch.
     */
    orderBy?: ExpertReviewOrderByWithRelationInput | ExpertReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExpertReviews.
     */
    cursor?: ExpertReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExpertReviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExpertReviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExpertReviews.
     */
    distinct?: ExpertReviewScalarFieldEnum | ExpertReviewScalarFieldEnum[]
  }

  /**
   * ExpertReview findMany
   */
  export type ExpertReviewFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpertReview
     */
    select?: ExpertReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpertReview
     */
    omit?: ExpertReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpertReviewInclude<ExtArgs> | null
    /**
     * Filter, which ExpertReviews to fetch.
     */
    where?: ExpertReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExpertReviews to fetch.
     */
    orderBy?: ExpertReviewOrderByWithRelationInput | ExpertReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ExpertReviews.
     */
    cursor?: ExpertReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExpertReviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExpertReviews.
     */
    skip?: number
    distinct?: ExpertReviewScalarFieldEnum | ExpertReviewScalarFieldEnum[]
  }

  /**
   * ExpertReview create
   */
  export type ExpertReviewCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpertReview
     */
    select?: ExpertReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpertReview
     */
    omit?: ExpertReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpertReviewInclude<ExtArgs> | null
    /**
     * The data needed to create a ExpertReview.
     */
    data: XOR<ExpertReviewCreateInput, ExpertReviewUncheckedCreateInput>
  }

  /**
   * ExpertReview createMany
   */
  export type ExpertReviewCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ExpertReviews.
     */
    data: ExpertReviewCreateManyInput | ExpertReviewCreateManyInput[]
  }

  /**
   * ExpertReview createManyAndReturn
   */
  export type ExpertReviewCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpertReview
     */
    select?: ExpertReviewSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExpertReview
     */
    omit?: ExpertReviewOmit<ExtArgs> | null
    /**
     * The data used to create many ExpertReviews.
     */
    data: ExpertReviewCreateManyInput | ExpertReviewCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpertReviewIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExpertReview update
   */
  export type ExpertReviewUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpertReview
     */
    select?: ExpertReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpertReview
     */
    omit?: ExpertReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpertReviewInclude<ExtArgs> | null
    /**
     * The data needed to update a ExpertReview.
     */
    data: XOR<ExpertReviewUpdateInput, ExpertReviewUncheckedUpdateInput>
    /**
     * Choose, which ExpertReview to update.
     */
    where: ExpertReviewWhereUniqueInput
  }

  /**
   * ExpertReview updateMany
   */
  export type ExpertReviewUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ExpertReviews.
     */
    data: XOR<ExpertReviewUpdateManyMutationInput, ExpertReviewUncheckedUpdateManyInput>
    /**
     * Filter which ExpertReviews to update
     */
    where?: ExpertReviewWhereInput
    /**
     * Limit how many ExpertReviews to update.
     */
    limit?: number
  }

  /**
   * ExpertReview updateManyAndReturn
   */
  export type ExpertReviewUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpertReview
     */
    select?: ExpertReviewSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExpertReview
     */
    omit?: ExpertReviewOmit<ExtArgs> | null
    /**
     * The data used to update ExpertReviews.
     */
    data: XOR<ExpertReviewUpdateManyMutationInput, ExpertReviewUncheckedUpdateManyInput>
    /**
     * Filter which ExpertReviews to update
     */
    where?: ExpertReviewWhereInput
    /**
     * Limit how many ExpertReviews to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpertReviewIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExpertReview upsert
   */
  export type ExpertReviewUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpertReview
     */
    select?: ExpertReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpertReview
     */
    omit?: ExpertReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpertReviewInclude<ExtArgs> | null
    /**
     * The filter to search for the ExpertReview to update in case it exists.
     */
    where: ExpertReviewWhereUniqueInput
    /**
     * In case the ExpertReview found by the `where` argument doesn't exist, create a new ExpertReview with this data.
     */
    create: XOR<ExpertReviewCreateInput, ExpertReviewUncheckedCreateInput>
    /**
     * In case the ExpertReview was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExpertReviewUpdateInput, ExpertReviewUncheckedUpdateInput>
  }

  /**
   * ExpertReview delete
   */
  export type ExpertReviewDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpertReview
     */
    select?: ExpertReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpertReview
     */
    omit?: ExpertReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpertReviewInclude<ExtArgs> | null
    /**
     * Filter which ExpertReview to delete.
     */
    where: ExpertReviewWhereUniqueInput
  }

  /**
   * ExpertReview deleteMany
   */
  export type ExpertReviewDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExpertReviews to delete
     */
    where?: ExpertReviewWhereInput
    /**
     * Limit how many ExpertReviews to delete.
     */
    limit?: number
  }

  /**
   * ExpertReview without action
   */
  export type ExpertReviewDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExpertReview
     */
    select?: ExpertReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExpertReview
     */
    omit?: ExpertReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExpertReviewInclude<ExtArgs> | null
  }


  /**
   * Model SearchLog
   */

  export type AggregateSearchLog = {
    _count: SearchLogCountAggregateOutputType | null
    _avg: SearchLogAvgAggregateOutputType | null
    _sum: SearchLogSumAggregateOutputType | null
    _min: SearchLogMinAggregateOutputType | null
    _max: SearchLogMaxAggregateOutputType | null
  }

  export type SearchLogAvgAggregateOutputType = {
    results: number | null
  }

  export type SearchLogSumAggregateOutputType = {
    results: number | null
  }

  export type SearchLogMinAggregateOutputType = {
    id: string | null
    userId: string | null
    query: string | null
    results: number | null
    clicked: string | null
    searchedAt: Date | null
  }

  export type SearchLogMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    query: string | null
    results: number | null
    clicked: string | null
    searchedAt: Date | null
  }

  export type SearchLogCountAggregateOutputType = {
    id: number
    userId: number
    query: number
    results: number
    clicked: number
    searchedAt: number
    _all: number
  }


  export type SearchLogAvgAggregateInputType = {
    results?: true
  }

  export type SearchLogSumAggregateInputType = {
    results?: true
  }

  export type SearchLogMinAggregateInputType = {
    id?: true
    userId?: true
    query?: true
    results?: true
    clicked?: true
    searchedAt?: true
  }

  export type SearchLogMaxAggregateInputType = {
    id?: true
    userId?: true
    query?: true
    results?: true
    clicked?: true
    searchedAt?: true
  }

  export type SearchLogCountAggregateInputType = {
    id?: true
    userId?: true
    query?: true
    results?: true
    clicked?: true
    searchedAt?: true
    _all?: true
  }

  export type SearchLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SearchLog to aggregate.
     */
    where?: SearchLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SearchLogs to fetch.
     */
    orderBy?: SearchLogOrderByWithRelationInput | SearchLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SearchLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SearchLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SearchLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SearchLogs
    **/
    _count?: true | SearchLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SearchLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SearchLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SearchLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SearchLogMaxAggregateInputType
  }

  export type GetSearchLogAggregateType<T extends SearchLogAggregateArgs> = {
        [P in keyof T & keyof AggregateSearchLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSearchLog[P]>
      : GetScalarType<T[P], AggregateSearchLog[P]>
  }




  export type SearchLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SearchLogWhereInput
    orderBy?: SearchLogOrderByWithAggregationInput | SearchLogOrderByWithAggregationInput[]
    by: SearchLogScalarFieldEnum[] | SearchLogScalarFieldEnum
    having?: SearchLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SearchLogCountAggregateInputType | true
    _avg?: SearchLogAvgAggregateInputType
    _sum?: SearchLogSumAggregateInputType
    _min?: SearchLogMinAggregateInputType
    _max?: SearchLogMaxAggregateInputType
  }

  export type SearchLogGroupByOutputType = {
    id: string
    userId: string
    query: string
    results: number
    clicked: string | null
    searchedAt: Date
    _count: SearchLogCountAggregateOutputType | null
    _avg: SearchLogAvgAggregateOutputType | null
    _sum: SearchLogSumAggregateOutputType | null
    _min: SearchLogMinAggregateOutputType | null
    _max: SearchLogMaxAggregateOutputType | null
  }

  type GetSearchLogGroupByPayload<T extends SearchLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SearchLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SearchLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SearchLogGroupByOutputType[P]>
            : GetScalarType<T[P], SearchLogGroupByOutputType[P]>
        }
      >
    >


  export type SearchLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    query?: boolean
    results?: boolean
    clicked?: boolean
    searchedAt?: boolean
  }, ExtArgs["result"]["searchLog"]>

  export type SearchLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    query?: boolean
    results?: boolean
    clicked?: boolean
    searchedAt?: boolean
  }, ExtArgs["result"]["searchLog"]>

  export type SearchLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    query?: boolean
    results?: boolean
    clicked?: boolean
    searchedAt?: boolean
  }, ExtArgs["result"]["searchLog"]>

  export type SearchLogSelectScalar = {
    id?: boolean
    userId?: boolean
    query?: boolean
    results?: boolean
    clicked?: boolean
    searchedAt?: boolean
  }

  export type SearchLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "query" | "results" | "clicked" | "searchedAt", ExtArgs["result"]["searchLog"]>

  export type $SearchLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SearchLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      query: string
      results: number
      clicked: string | null
      searchedAt: Date
    }, ExtArgs["result"]["searchLog"]>
    composites: {}
  }

  type SearchLogGetPayload<S extends boolean | null | undefined | SearchLogDefaultArgs> = $Result.GetResult<Prisma.$SearchLogPayload, S>

  type SearchLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SearchLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SearchLogCountAggregateInputType | true
    }

  export interface SearchLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SearchLog'], meta: { name: 'SearchLog' } }
    /**
     * Find zero or one SearchLog that matches the filter.
     * @param {SearchLogFindUniqueArgs} args - Arguments to find a SearchLog
     * @example
     * // Get one SearchLog
     * const searchLog = await prisma.searchLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SearchLogFindUniqueArgs>(args: SelectSubset<T, SearchLogFindUniqueArgs<ExtArgs>>): Prisma__SearchLogClient<$Result.GetResult<Prisma.$SearchLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SearchLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SearchLogFindUniqueOrThrowArgs} args - Arguments to find a SearchLog
     * @example
     * // Get one SearchLog
     * const searchLog = await prisma.searchLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SearchLogFindUniqueOrThrowArgs>(args: SelectSubset<T, SearchLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SearchLogClient<$Result.GetResult<Prisma.$SearchLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SearchLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SearchLogFindFirstArgs} args - Arguments to find a SearchLog
     * @example
     * // Get one SearchLog
     * const searchLog = await prisma.searchLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SearchLogFindFirstArgs>(args?: SelectSubset<T, SearchLogFindFirstArgs<ExtArgs>>): Prisma__SearchLogClient<$Result.GetResult<Prisma.$SearchLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SearchLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SearchLogFindFirstOrThrowArgs} args - Arguments to find a SearchLog
     * @example
     * // Get one SearchLog
     * const searchLog = await prisma.searchLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SearchLogFindFirstOrThrowArgs>(args?: SelectSubset<T, SearchLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__SearchLogClient<$Result.GetResult<Prisma.$SearchLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SearchLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SearchLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SearchLogs
     * const searchLogs = await prisma.searchLog.findMany()
     * 
     * // Get first 10 SearchLogs
     * const searchLogs = await prisma.searchLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const searchLogWithIdOnly = await prisma.searchLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SearchLogFindManyArgs>(args?: SelectSubset<T, SearchLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SearchLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SearchLog.
     * @param {SearchLogCreateArgs} args - Arguments to create a SearchLog.
     * @example
     * // Create one SearchLog
     * const SearchLog = await prisma.searchLog.create({
     *   data: {
     *     // ... data to create a SearchLog
     *   }
     * })
     * 
     */
    create<T extends SearchLogCreateArgs>(args: SelectSubset<T, SearchLogCreateArgs<ExtArgs>>): Prisma__SearchLogClient<$Result.GetResult<Prisma.$SearchLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SearchLogs.
     * @param {SearchLogCreateManyArgs} args - Arguments to create many SearchLogs.
     * @example
     * // Create many SearchLogs
     * const searchLog = await prisma.searchLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SearchLogCreateManyArgs>(args?: SelectSubset<T, SearchLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SearchLogs and returns the data saved in the database.
     * @param {SearchLogCreateManyAndReturnArgs} args - Arguments to create many SearchLogs.
     * @example
     * // Create many SearchLogs
     * const searchLog = await prisma.searchLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SearchLogs and only return the `id`
     * const searchLogWithIdOnly = await prisma.searchLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SearchLogCreateManyAndReturnArgs>(args?: SelectSubset<T, SearchLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SearchLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SearchLog.
     * @param {SearchLogDeleteArgs} args - Arguments to delete one SearchLog.
     * @example
     * // Delete one SearchLog
     * const SearchLog = await prisma.searchLog.delete({
     *   where: {
     *     // ... filter to delete one SearchLog
     *   }
     * })
     * 
     */
    delete<T extends SearchLogDeleteArgs>(args: SelectSubset<T, SearchLogDeleteArgs<ExtArgs>>): Prisma__SearchLogClient<$Result.GetResult<Prisma.$SearchLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SearchLog.
     * @param {SearchLogUpdateArgs} args - Arguments to update one SearchLog.
     * @example
     * // Update one SearchLog
     * const searchLog = await prisma.searchLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SearchLogUpdateArgs>(args: SelectSubset<T, SearchLogUpdateArgs<ExtArgs>>): Prisma__SearchLogClient<$Result.GetResult<Prisma.$SearchLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SearchLogs.
     * @param {SearchLogDeleteManyArgs} args - Arguments to filter SearchLogs to delete.
     * @example
     * // Delete a few SearchLogs
     * const { count } = await prisma.searchLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SearchLogDeleteManyArgs>(args?: SelectSubset<T, SearchLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SearchLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SearchLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SearchLogs
     * const searchLog = await prisma.searchLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SearchLogUpdateManyArgs>(args: SelectSubset<T, SearchLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SearchLogs and returns the data updated in the database.
     * @param {SearchLogUpdateManyAndReturnArgs} args - Arguments to update many SearchLogs.
     * @example
     * // Update many SearchLogs
     * const searchLog = await prisma.searchLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SearchLogs and only return the `id`
     * const searchLogWithIdOnly = await prisma.searchLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SearchLogUpdateManyAndReturnArgs>(args: SelectSubset<T, SearchLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SearchLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SearchLog.
     * @param {SearchLogUpsertArgs} args - Arguments to update or create a SearchLog.
     * @example
     * // Update or create a SearchLog
     * const searchLog = await prisma.searchLog.upsert({
     *   create: {
     *     // ... data to create a SearchLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SearchLog we want to update
     *   }
     * })
     */
    upsert<T extends SearchLogUpsertArgs>(args: SelectSubset<T, SearchLogUpsertArgs<ExtArgs>>): Prisma__SearchLogClient<$Result.GetResult<Prisma.$SearchLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SearchLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SearchLogCountArgs} args - Arguments to filter SearchLogs to count.
     * @example
     * // Count the number of SearchLogs
     * const count = await prisma.searchLog.count({
     *   where: {
     *     // ... the filter for the SearchLogs we want to count
     *   }
     * })
    **/
    count<T extends SearchLogCountArgs>(
      args?: Subset<T, SearchLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SearchLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SearchLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SearchLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SearchLogAggregateArgs>(args: Subset<T, SearchLogAggregateArgs>): Prisma.PrismaPromise<GetSearchLogAggregateType<T>>

    /**
     * Group by SearchLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SearchLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SearchLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SearchLogGroupByArgs['orderBy'] }
        : { orderBy?: SearchLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SearchLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSearchLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SearchLog model
   */
  readonly fields: SearchLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SearchLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SearchLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SearchLog model
   */
  interface SearchLogFieldRefs {
    readonly id: FieldRef<"SearchLog", 'String'>
    readonly userId: FieldRef<"SearchLog", 'String'>
    readonly query: FieldRef<"SearchLog", 'String'>
    readonly results: FieldRef<"SearchLog", 'Int'>
    readonly clicked: FieldRef<"SearchLog", 'String'>
    readonly searchedAt: FieldRef<"SearchLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SearchLog findUnique
   */
  export type SearchLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchLog
     */
    select?: SearchLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchLog
     */
    omit?: SearchLogOmit<ExtArgs> | null
    /**
     * Filter, which SearchLog to fetch.
     */
    where: SearchLogWhereUniqueInput
  }

  /**
   * SearchLog findUniqueOrThrow
   */
  export type SearchLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchLog
     */
    select?: SearchLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchLog
     */
    omit?: SearchLogOmit<ExtArgs> | null
    /**
     * Filter, which SearchLog to fetch.
     */
    where: SearchLogWhereUniqueInput
  }

  /**
   * SearchLog findFirst
   */
  export type SearchLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchLog
     */
    select?: SearchLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchLog
     */
    omit?: SearchLogOmit<ExtArgs> | null
    /**
     * Filter, which SearchLog to fetch.
     */
    where?: SearchLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SearchLogs to fetch.
     */
    orderBy?: SearchLogOrderByWithRelationInput | SearchLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SearchLogs.
     */
    cursor?: SearchLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SearchLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SearchLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SearchLogs.
     */
    distinct?: SearchLogScalarFieldEnum | SearchLogScalarFieldEnum[]
  }

  /**
   * SearchLog findFirstOrThrow
   */
  export type SearchLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchLog
     */
    select?: SearchLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchLog
     */
    omit?: SearchLogOmit<ExtArgs> | null
    /**
     * Filter, which SearchLog to fetch.
     */
    where?: SearchLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SearchLogs to fetch.
     */
    orderBy?: SearchLogOrderByWithRelationInput | SearchLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SearchLogs.
     */
    cursor?: SearchLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SearchLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SearchLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SearchLogs.
     */
    distinct?: SearchLogScalarFieldEnum | SearchLogScalarFieldEnum[]
  }

  /**
   * SearchLog findMany
   */
  export type SearchLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchLog
     */
    select?: SearchLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchLog
     */
    omit?: SearchLogOmit<ExtArgs> | null
    /**
     * Filter, which SearchLogs to fetch.
     */
    where?: SearchLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SearchLogs to fetch.
     */
    orderBy?: SearchLogOrderByWithRelationInput | SearchLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SearchLogs.
     */
    cursor?: SearchLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SearchLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SearchLogs.
     */
    skip?: number
    distinct?: SearchLogScalarFieldEnum | SearchLogScalarFieldEnum[]
  }

  /**
   * SearchLog create
   */
  export type SearchLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchLog
     */
    select?: SearchLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchLog
     */
    omit?: SearchLogOmit<ExtArgs> | null
    /**
     * The data needed to create a SearchLog.
     */
    data: XOR<SearchLogCreateInput, SearchLogUncheckedCreateInput>
  }

  /**
   * SearchLog createMany
   */
  export type SearchLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SearchLogs.
     */
    data: SearchLogCreateManyInput | SearchLogCreateManyInput[]
  }

  /**
   * SearchLog createManyAndReturn
   */
  export type SearchLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchLog
     */
    select?: SearchLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SearchLog
     */
    omit?: SearchLogOmit<ExtArgs> | null
    /**
     * The data used to create many SearchLogs.
     */
    data: SearchLogCreateManyInput | SearchLogCreateManyInput[]
  }

  /**
   * SearchLog update
   */
  export type SearchLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchLog
     */
    select?: SearchLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchLog
     */
    omit?: SearchLogOmit<ExtArgs> | null
    /**
     * The data needed to update a SearchLog.
     */
    data: XOR<SearchLogUpdateInput, SearchLogUncheckedUpdateInput>
    /**
     * Choose, which SearchLog to update.
     */
    where: SearchLogWhereUniqueInput
  }

  /**
   * SearchLog updateMany
   */
  export type SearchLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SearchLogs.
     */
    data: XOR<SearchLogUpdateManyMutationInput, SearchLogUncheckedUpdateManyInput>
    /**
     * Filter which SearchLogs to update
     */
    where?: SearchLogWhereInput
    /**
     * Limit how many SearchLogs to update.
     */
    limit?: number
  }

  /**
   * SearchLog updateManyAndReturn
   */
  export type SearchLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchLog
     */
    select?: SearchLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SearchLog
     */
    omit?: SearchLogOmit<ExtArgs> | null
    /**
     * The data used to update SearchLogs.
     */
    data: XOR<SearchLogUpdateManyMutationInput, SearchLogUncheckedUpdateManyInput>
    /**
     * Filter which SearchLogs to update
     */
    where?: SearchLogWhereInput
    /**
     * Limit how many SearchLogs to update.
     */
    limit?: number
  }

  /**
   * SearchLog upsert
   */
  export type SearchLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchLog
     */
    select?: SearchLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchLog
     */
    omit?: SearchLogOmit<ExtArgs> | null
    /**
     * The filter to search for the SearchLog to update in case it exists.
     */
    where: SearchLogWhereUniqueInput
    /**
     * In case the SearchLog found by the `where` argument doesn't exist, create a new SearchLog with this data.
     */
    create: XOR<SearchLogCreateInput, SearchLogUncheckedCreateInput>
    /**
     * In case the SearchLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SearchLogUpdateInput, SearchLogUncheckedUpdateInput>
  }

  /**
   * SearchLog delete
   */
  export type SearchLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchLog
     */
    select?: SearchLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchLog
     */
    omit?: SearchLogOmit<ExtArgs> | null
    /**
     * Filter which SearchLog to delete.
     */
    where: SearchLogWhereUniqueInput
  }

  /**
   * SearchLog deleteMany
   */
  export type SearchLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SearchLogs to delete
     */
    where?: SearchLogWhereInput
    /**
     * Limit how many SearchLogs to delete.
     */
    limit?: number
  }

  /**
   * SearchLog without action
   */
  export type SearchLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SearchLog
     */
    select?: SearchLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SearchLog
     */
    omit?: SearchLogOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const KnowledgeCategoryScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    icon: 'icon',
    color: 'color',
    order: 'order',
    parentId: 'parentId',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type KnowledgeCategoryScalarFieldEnum = (typeof KnowledgeCategoryScalarFieldEnum)[keyof typeof KnowledgeCategoryScalarFieldEnum]


  export const ArticleScalarFieldEnum: {
    id: 'id',
    title: 'title',
    content: 'content',
    summary: 'summary',
    categoryId: 'categoryId',
    authorId: 'authorId',
    status: 'status',
    visibility: 'visibility',
    tags: 'tags',
    keywords: 'keywords',
    estimatedReadTime: 'estimatedReadTime',
    difficulty: 'difficulty',
    viewCount: 'viewCount',
    likeCount: 'likeCount',
    reviewerId: 'reviewerId',
    reviewedAt: 'reviewedAt',
    publishedAt: 'publishedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ArticleScalarFieldEnum = (typeof ArticleScalarFieldEnum)[keyof typeof ArticleScalarFieldEnum]


  export const ArticleRevisionScalarFieldEnum: {
    id: 'id',
    articleId: 'articleId',
    version: 'version',
    title: 'title',
    content: 'content',
    summary: 'summary',
    changes: 'changes',
    authorId: 'authorId',
    createdAt: 'createdAt'
  };

  export type ArticleRevisionScalarFieldEnum = (typeof ArticleRevisionScalarFieldEnum)[keyof typeof ArticleRevisionScalarFieldEnum]


  export const ArticleCommentScalarFieldEnum: {
    id: 'id',
    articleId: 'articleId',
    authorId: 'authorId',
    content: 'content',
    parentId: 'parentId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ArticleCommentScalarFieldEnum = (typeof ArticleCommentScalarFieldEnum)[keyof typeof ArticleCommentScalarFieldEnum]


  export const ArticleLikeScalarFieldEnum: {
    id: 'id',
    articleId: 'articleId',
    userId: 'userId',
    createdAt: 'createdAt'
  };

  export type ArticleLikeScalarFieldEnum = (typeof ArticleLikeScalarFieldEnum)[keyof typeof ArticleLikeScalarFieldEnum]


  export const ArticleViewScalarFieldEnum: {
    id: 'id',
    articleId: 'articleId',
    userId: 'userId',
    duration: 'duration',
    viewedAt: 'viewedAt'
  };

  export type ArticleViewScalarFieldEnum = (typeof ArticleViewScalarFieldEnum)[keyof typeof ArticleViewScalarFieldEnum]


  export const ArticleAttachmentScalarFieldEnum: {
    id: 'id',
    articleId: 'articleId',
    filename: 'filename',
    originalName: 'originalName',
    mimeType: 'mimeType',
    size: 'size',
    url: 'url',
    createdAt: 'createdAt'
  };

  export type ArticleAttachmentScalarFieldEnum = (typeof ArticleAttachmentScalarFieldEnum)[keyof typeof ArticleAttachmentScalarFieldEnum]


  export const TemplateScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    content: 'content',
    categoryId: 'categoryId',
    authorId: 'authorId',
    type: 'type',
    tags: 'tags',
    variables: 'variables',
    useCount: 'useCount',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TemplateScalarFieldEnum = (typeof TemplateScalarFieldEnum)[keyof typeof TemplateScalarFieldEnum]


  export const FAQScalarFieldEnum: {
    id: 'id',
    question: 'question',
    answer: 'answer',
    categoryId: 'categoryId',
    authorId: 'authorId',
    viewCount: 'viewCount',
    helpfulCount: 'helpfulCount',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FAQScalarFieldEnum = (typeof FAQScalarFieldEnum)[keyof typeof FAQScalarFieldEnum]


  export const FAQFeedbackScalarFieldEnum: {
    id: 'id',
    faqId: 'faqId',
    userId: 'userId',
    isHelpful: 'isHelpful',
    comment: 'comment',
    createdAt: 'createdAt'
  };

  export type FAQFeedbackScalarFieldEnum = (typeof FAQFeedbackScalarFieldEnum)[keyof typeof FAQFeedbackScalarFieldEnum]


  export const ExpertScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    bio: 'bio',
    specialties: 'specialties',
    certifications: 'certifications',
    experience: 'experience',
    contactInfo: 'contactInfo',
    rating: 'rating',
    reviewCount: 'reviewCount',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ExpertScalarFieldEnum = (typeof ExpertScalarFieldEnum)[keyof typeof ExpertScalarFieldEnum]


  export const ExpertReviewScalarFieldEnum: {
    id: 'id',
    expertId: 'expertId',
    reviewerId: 'reviewerId',
    rating: 'rating',
    comment: 'comment',
    createdAt: 'createdAt'
  };

  export type ExpertReviewScalarFieldEnum = (typeof ExpertReviewScalarFieldEnum)[keyof typeof ExpertReviewScalarFieldEnum]


  export const SearchLogScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    query: 'query',
    results: 'results',
    clicked: 'clicked',
    searchedAt: 'searchedAt'
  };

  export type SearchLogScalarFieldEnum = (typeof SearchLogScalarFieldEnum)[keyof typeof SearchLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'ArticleStatus'
   */
  export type EnumArticleStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ArticleStatus'>
    


  /**
   * Reference to a field of type 'ArticleVisibility'
   */
  export type EnumArticleVisibilityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ArticleVisibility'>
    


  /**
   * Reference to a field of type 'DifficultyLevel'
   */
  export type EnumDifficultyLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DifficultyLevel'>
    


  /**
   * Reference to a field of type 'TemplateType'
   */
  export type EnumTemplateTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TemplateType'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type KnowledgeCategoryWhereInput = {
    AND?: KnowledgeCategoryWhereInput | KnowledgeCategoryWhereInput[]
    OR?: KnowledgeCategoryWhereInput[]
    NOT?: KnowledgeCategoryWhereInput | KnowledgeCategoryWhereInput[]
    id?: StringFilter<"KnowledgeCategory"> | string
    name?: StringFilter<"KnowledgeCategory"> | string
    description?: StringNullableFilter<"KnowledgeCategory"> | string | null
    icon?: StringNullableFilter<"KnowledgeCategory"> | string | null
    color?: StringNullableFilter<"KnowledgeCategory"> | string | null
    order?: IntFilter<"KnowledgeCategory"> | number
    parentId?: StringNullableFilter<"KnowledgeCategory"> | string | null
    isActive?: BoolFilter<"KnowledgeCategory"> | boolean
    createdAt?: DateTimeFilter<"KnowledgeCategory"> | Date | string
    updatedAt?: DateTimeFilter<"KnowledgeCategory"> | Date | string
    parent?: XOR<KnowledgeCategoryNullableScalarRelationFilter, KnowledgeCategoryWhereInput> | null
    children?: KnowledgeCategoryListRelationFilter
    articles?: ArticleListRelationFilter
    templates?: TemplateListRelationFilter
    faqs?: FAQListRelationFilter
  }

  export type KnowledgeCategoryOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    icon?: SortOrderInput | SortOrder
    color?: SortOrderInput | SortOrder
    order?: SortOrder
    parentId?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    parent?: KnowledgeCategoryOrderByWithRelationInput
    children?: KnowledgeCategoryOrderByRelationAggregateInput
    articles?: ArticleOrderByRelationAggregateInput
    templates?: TemplateOrderByRelationAggregateInput
    faqs?: FAQOrderByRelationAggregateInput
  }

  export type KnowledgeCategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: KnowledgeCategoryWhereInput | KnowledgeCategoryWhereInput[]
    OR?: KnowledgeCategoryWhereInput[]
    NOT?: KnowledgeCategoryWhereInput | KnowledgeCategoryWhereInput[]
    description?: StringNullableFilter<"KnowledgeCategory"> | string | null
    icon?: StringNullableFilter<"KnowledgeCategory"> | string | null
    color?: StringNullableFilter<"KnowledgeCategory"> | string | null
    order?: IntFilter<"KnowledgeCategory"> | number
    parentId?: StringNullableFilter<"KnowledgeCategory"> | string | null
    isActive?: BoolFilter<"KnowledgeCategory"> | boolean
    createdAt?: DateTimeFilter<"KnowledgeCategory"> | Date | string
    updatedAt?: DateTimeFilter<"KnowledgeCategory"> | Date | string
    parent?: XOR<KnowledgeCategoryNullableScalarRelationFilter, KnowledgeCategoryWhereInput> | null
    children?: KnowledgeCategoryListRelationFilter
    articles?: ArticleListRelationFilter
    templates?: TemplateListRelationFilter
    faqs?: FAQListRelationFilter
  }, "id" | "name">

  export type KnowledgeCategoryOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    icon?: SortOrderInput | SortOrder
    color?: SortOrderInput | SortOrder
    order?: SortOrder
    parentId?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: KnowledgeCategoryCountOrderByAggregateInput
    _avg?: KnowledgeCategoryAvgOrderByAggregateInput
    _max?: KnowledgeCategoryMaxOrderByAggregateInput
    _min?: KnowledgeCategoryMinOrderByAggregateInput
    _sum?: KnowledgeCategorySumOrderByAggregateInput
  }

  export type KnowledgeCategoryScalarWhereWithAggregatesInput = {
    AND?: KnowledgeCategoryScalarWhereWithAggregatesInput | KnowledgeCategoryScalarWhereWithAggregatesInput[]
    OR?: KnowledgeCategoryScalarWhereWithAggregatesInput[]
    NOT?: KnowledgeCategoryScalarWhereWithAggregatesInput | KnowledgeCategoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"KnowledgeCategory"> | string
    name?: StringWithAggregatesFilter<"KnowledgeCategory"> | string
    description?: StringNullableWithAggregatesFilter<"KnowledgeCategory"> | string | null
    icon?: StringNullableWithAggregatesFilter<"KnowledgeCategory"> | string | null
    color?: StringNullableWithAggregatesFilter<"KnowledgeCategory"> | string | null
    order?: IntWithAggregatesFilter<"KnowledgeCategory"> | number
    parentId?: StringNullableWithAggregatesFilter<"KnowledgeCategory"> | string | null
    isActive?: BoolWithAggregatesFilter<"KnowledgeCategory"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"KnowledgeCategory"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"KnowledgeCategory"> | Date | string
  }

  export type ArticleWhereInput = {
    AND?: ArticleWhereInput | ArticleWhereInput[]
    OR?: ArticleWhereInput[]
    NOT?: ArticleWhereInput | ArticleWhereInput[]
    id?: StringFilter<"Article"> | string
    title?: StringFilter<"Article"> | string
    content?: StringFilter<"Article"> | string
    summary?: StringNullableFilter<"Article"> | string | null
    categoryId?: StringFilter<"Article"> | string
    authorId?: StringFilter<"Article"> | string
    status?: EnumArticleStatusFilter<"Article"> | $Enums.ArticleStatus
    visibility?: EnumArticleVisibilityFilter<"Article"> | $Enums.ArticleVisibility
    tags?: StringNullableFilter<"Article"> | string | null
    keywords?: StringNullableFilter<"Article"> | string | null
    estimatedReadTime?: IntNullableFilter<"Article"> | number | null
    difficulty?: EnumDifficultyLevelFilter<"Article"> | $Enums.DifficultyLevel
    viewCount?: IntFilter<"Article"> | number
    likeCount?: IntFilter<"Article"> | number
    reviewerId?: StringNullableFilter<"Article"> | string | null
    reviewedAt?: DateTimeNullableFilter<"Article"> | Date | string | null
    publishedAt?: DateTimeNullableFilter<"Article"> | Date | string | null
    createdAt?: DateTimeFilter<"Article"> | Date | string
    updatedAt?: DateTimeFilter<"Article"> | Date | string
    category?: XOR<KnowledgeCategoryScalarRelationFilter, KnowledgeCategoryWhereInput>
    comments?: ArticleCommentListRelationFilter
    likes?: ArticleLikeListRelationFilter
    views?: ArticleViewListRelationFilter
    revisions?: ArticleRevisionListRelationFilter
    attachments?: ArticleAttachmentListRelationFilter
  }

  export type ArticleOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    summary?: SortOrderInput | SortOrder
    categoryId?: SortOrder
    authorId?: SortOrder
    status?: SortOrder
    visibility?: SortOrder
    tags?: SortOrderInput | SortOrder
    keywords?: SortOrderInput | SortOrder
    estimatedReadTime?: SortOrderInput | SortOrder
    difficulty?: SortOrder
    viewCount?: SortOrder
    likeCount?: SortOrder
    reviewerId?: SortOrderInput | SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    publishedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    category?: KnowledgeCategoryOrderByWithRelationInput
    comments?: ArticleCommentOrderByRelationAggregateInput
    likes?: ArticleLikeOrderByRelationAggregateInput
    views?: ArticleViewOrderByRelationAggregateInput
    revisions?: ArticleRevisionOrderByRelationAggregateInput
    attachments?: ArticleAttachmentOrderByRelationAggregateInput
  }

  export type ArticleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ArticleWhereInput | ArticleWhereInput[]
    OR?: ArticleWhereInput[]
    NOT?: ArticleWhereInput | ArticleWhereInput[]
    title?: StringFilter<"Article"> | string
    content?: StringFilter<"Article"> | string
    summary?: StringNullableFilter<"Article"> | string | null
    categoryId?: StringFilter<"Article"> | string
    authorId?: StringFilter<"Article"> | string
    status?: EnumArticleStatusFilter<"Article"> | $Enums.ArticleStatus
    visibility?: EnumArticleVisibilityFilter<"Article"> | $Enums.ArticleVisibility
    tags?: StringNullableFilter<"Article"> | string | null
    keywords?: StringNullableFilter<"Article"> | string | null
    estimatedReadTime?: IntNullableFilter<"Article"> | number | null
    difficulty?: EnumDifficultyLevelFilter<"Article"> | $Enums.DifficultyLevel
    viewCount?: IntFilter<"Article"> | number
    likeCount?: IntFilter<"Article"> | number
    reviewerId?: StringNullableFilter<"Article"> | string | null
    reviewedAt?: DateTimeNullableFilter<"Article"> | Date | string | null
    publishedAt?: DateTimeNullableFilter<"Article"> | Date | string | null
    createdAt?: DateTimeFilter<"Article"> | Date | string
    updatedAt?: DateTimeFilter<"Article"> | Date | string
    category?: XOR<KnowledgeCategoryScalarRelationFilter, KnowledgeCategoryWhereInput>
    comments?: ArticleCommentListRelationFilter
    likes?: ArticleLikeListRelationFilter
    views?: ArticleViewListRelationFilter
    revisions?: ArticleRevisionListRelationFilter
    attachments?: ArticleAttachmentListRelationFilter
  }, "id">

  export type ArticleOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    summary?: SortOrderInput | SortOrder
    categoryId?: SortOrder
    authorId?: SortOrder
    status?: SortOrder
    visibility?: SortOrder
    tags?: SortOrderInput | SortOrder
    keywords?: SortOrderInput | SortOrder
    estimatedReadTime?: SortOrderInput | SortOrder
    difficulty?: SortOrder
    viewCount?: SortOrder
    likeCount?: SortOrder
    reviewerId?: SortOrderInput | SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    publishedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ArticleCountOrderByAggregateInput
    _avg?: ArticleAvgOrderByAggregateInput
    _max?: ArticleMaxOrderByAggregateInput
    _min?: ArticleMinOrderByAggregateInput
    _sum?: ArticleSumOrderByAggregateInput
  }

  export type ArticleScalarWhereWithAggregatesInput = {
    AND?: ArticleScalarWhereWithAggregatesInput | ArticleScalarWhereWithAggregatesInput[]
    OR?: ArticleScalarWhereWithAggregatesInput[]
    NOT?: ArticleScalarWhereWithAggregatesInput | ArticleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Article"> | string
    title?: StringWithAggregatesFilter<"Article"> | string
    content?: StringWithAggregatesFilter<"Article"> | string
    summary?: StringNullableWithAggregatesFilter<"Article"> | string | null
    categoryId?: StringWithAggregatesFilter<"Article"> | string
    authorId?: StringWithAggregatesFilter<"Article"> | string
    status?: EnumArticleStatusWithAggregatesFilter<"Article"> | $Enums.ArticleStatus
    visibility?: EnumArticleVisibilityWithAggregatesFilter<"Article"> | $Enums.ArticleVisibility
    tags?: StringNullableWithAggregatesFilter<"Article"> | string | null
    keywords?: StringNullableWithAggregatesFilter<"Article"> | string | null
    estimatedReadTime?: IntNullableWithAggregatesFilter<"Article"> | number | null
    difficulty?: EnumDifficultyLevelWithAggregatesFilter<"Article"> | $Enums.DifficultyLevel
    viewCount?: IntWithAggregatesFilter<"Article"> | number
    likeCount?: IntWithAggregatesFilter<"Article"> | number
    reviewerId?: StringNullableWithAggregatesFilter<"Article"> | string | null
    reviewedAt?: DateTimeNullableWithAggregatesFilter<"Article"> | Date | string | null
    publishedAt?: DateTimeNullableWithAggregatesFilter<"Article"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Article"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Article"> | Date | string
  }

  export type ArticleRevisionWhereInput = {
    AND?: ArticleRevisionWhereInput | ArticleRevisionWhereInput[]
    OR?: ArticleRevisionWhereInput[]
    NOT?: ArticleRevisionWhereInput | ArticleRevisionWhereInput[]
    id?: StringFilter<"ArticleRevision"> | string
    articleId?: StringFilter<"ArticleRevision"> | string
    version?: IntFilter<"ArticleRevision"> | number
    title?: StringFilter<"ArticleRevision"> | string
    content?: StringFilter<"ArticleRevision"> | string
    summary?: StringNullableFilter<"ArticleRevision"> | string | null
    changes?: StringNullableFilter<"ArticleRevision"> | string | null
    authorId?: StringFilter<"ArticleRevision"> | string
    createdAt?: DateTimeFilter<"ArticleRevision"> | Date | string
    article?: XOR<ArticleScalarRelationFilter, ArticleWhereInput>
  }

  export type ArticleRevisionOrderByWithRelationInput = {
    id?: SortOrder
    articleId?: SortOrder
    version?: SortOrder
    title?: SortOrder
    content?: SortOrder
    summary?: SortOrderInput | SortOrder
    changes?: SortOrderInput | SortOrder
    authorId?: SortOrder
    createdAt?: SortOrder
    article?: ArticleOrderByWithRelationInput
  }

  export type ArticleRevisionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    articleId_version?: ArticleRevisionArticleIdVersionCompoundUniqueInput
    AND?: ArticleRevisionWhereInput | ArticleRevisionWhereInput[]
    OR?: ArticleRevisionWhereInput[]
    NOT?: ArticleRevisionWhereInput | ArticleRevisionWhereInput[]
    articleId?: StringFilter<"ArticleRevision"> | string
    version?: IntFilter<"ArticleRevision"> | number
    title?: StringFilter<"ArticleRevision"> | string
    content?: StringFilter<"ArticleRevision"> | string
    summary?: StringNullableFilter<"ArticleRevision"> | string | null
    changes?: StringNullableFilter<"ArticleRevision"> | string | null
    authorId?: StringFilter<"ArticleRevision"> | string
    createdAt?: DateTimeFilter<"ArticleRevision"> | Date | string
    article?: XOR<ArticleScalarRelationFilter, ArticleWhereInput>
  }, "id" | "articleId_version">

  export type ArticleRevisionOrderByWithAggregationInput = {
    id?: SortOrder
    articleId?: SortOrder
    version?: SortOrder
    title?: SortOrder
    content?: SortOrder
    summary?: SortOrderInput | SortOrder
    changes?: SortOrderInput | SortOrder
    authorId?: SortOrder
    createdAt?: SortOrder
    _count?: ArticleRevisionCountOrderByAggregateInput
    _avg?: ArticleRevisionAvgOrderByAggregateInput
    _max?: ArticleRevisionMaxOrderByAggregateInput
    _min?: ArticleRevisionMinOrderByAggregateInput
    _sum?: ArticleRevisionSumOrderByAggregateInput
  }

  export type ArticleRevisionScalarWhereWithAggregatesInput = {
    AND?: ArticleRevisionScalarWhereWithAggregatesInput | ArticleRevisionScalarWhereWithAggregatesInput[]
    OR?: ArticleRevisionScalarWhereWithAggregatesInput[]
    NOT?: ArticleRevisionScalarWhereWithAggregatesInput | ArticleRevisionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ArticleRevision"> | string
    articleId?: StringWithAggregatesFilter<"ArticleRevision"> | string
    version?: IntWithAggregatesFilter<"ArticleRevision"> | number
    title?: StringWithAggregatesFilter<"ArticleRevision"> | string
    content?: StringWithAggregatesFilter<"ArticleRevision"> | string
    summary?: StringNullableWithAggregatesFilter<"ArticleRevision"> | string | null
    changes?: StringNullableWithAggregatesFilter<"ArticleRevision"> | string | null
    authorId?: StringWithAggregatesFilter<"ArticleRevision"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ArticleRevision"> | Date | string
  }

  export type ArticleCommentWhereInput = {
    AND?: ArticleCommentWhereInput | ArticleCommentWhereInput[]
    OR?: ArticleCommentWhereInput[]
    NOT?: ArticleCommentWhereInput | ArticleCommentWhereInput[]
    id?: StringFilter<"ArticleComment"> | string
    articleId?: StringFilter<"ArticleComment"> | string
    authorId?: StringFilter<"ArticleComment"> | string
    content?: StringFilter<"ArticleComment"> | string
    parentId?: StringNullableFilter<"ArticleComment"> | string | null
    createdAt?: DateTimeFilter<"ArticleComment"> | Date | string
    updatedAt?: DateTimeFilter<"ArticleComment"> | Date | string
    article?: XOR<ArticleScalarRelationFilter, ArticleWhereInput>
    parent?: XOR<ArticleCommentNullableScalarRelationFilter, ArticleCommentWhereInput> | null
    replies?: ArticleCommentListRelationFilter
  }

  export type ArticleCommentOrderByWithRelationInput = {
    id?: SortOrder
    articleId?: SortOrder
    authorId?: SortOrder
    content?: SortOrder
    parentId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    article?: ArticleOrderByWithRelationInput
    parent?: ArticleCommentOrderByWithRelationInput
    replies?: ArticleCommentOrderByRelationAggregateInput
  }

  export type ArticleCommentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ArticleCommentWhereInput | ArticleCommentWhereInput[]
    OR?: ArticleCommentWhereInput[]
    NOT?: ArticleCommentWhereInput | ArticleCommentWhereInput[]
    articleId?: StringFilter<"ArticleComment"> | string
    authorId?: StringFilter<"ArticleComment"> | string
    content?: StringFilter<"ArticleComment"> | string
    parentId?: StringNullableFilter<"ArticleComment"> | string | null
    createdAt?: DateTimeFilter<"ArticleComment"> | Date | string
    updatedAt?: DateTimeFilter<"ArticleComment"> | Date | string
    article?: XOR<ArticleScalarRelationFilter, ArticleWhereInput>
    parent?: XOR<ArticleCommentNullableScalarRelationFilter, ArticleCommentWhereInput> | null
    replies?: ArticleCommentListRelationFilter
  }, "id">

  export type ArticleCommentOrderByWithAggregationInput = {
    id?: SortOrder
    articleId?: SortOrder
    authorId?: SortOrder
    content?: SortOrder
    parentId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ArticleCommentCountOrderByAggregateInput
    _max?: ArticleCommentMaxOrderByAggregateInput
    _min?: ArticleCommentMinOrderByAggregateInput
  }

  export type ArticleCommentScalarWhereWithAggregatesInput = {
    AND?: ArticleCommentScalarWhereWithAggregatesInput | ArticleCommentScalarWhereWithAggregatesInput[]
    OR?: ArticleCommentScalarWhereWithAggregatesInput[]
    NOT?: ArticleCommentScalarWhereWithAggregatesInput | ArticleCommentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ArticleComment"> | string
    articleId?: StringWithAggregatesFilter<"ArticleComment"> | string
    authorId?: StringWithAggregatesFilter<"ArticleComment"> | string
    content?: StringWithAggregatesFilter<"ArticleComment"> | string
    parentId?: StringNullableWithAggregatesFilter<"ArticleComment"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ArticleComment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ArticleComment"> | Date | string
  }

  export type ArticleLikeWhereInput = {
    AND?: ArticleLikeWhereInput | ArticleLikeWhereInput[]
    OR?: ArticleLikeWhereInput[]
    NOT?: ArticleLikeWhereInput | ArticleLikeWhereInput[]
    id?: StringFilter<"ArticleLike"> | string
    articleId?: StringFilter<"ArticleLike"> | string
    userId?: StringFilter<"ArticleLike"> | string
    createdAt?: DateTimeFilter<"ArticleLike"> | Date | string
    article?: XOR<ArticleScalarRelationFilter, ArticleWhereInput>
  }

  export type ArticleLikeOrderByWithRelationInput = {
    id?: SortOrder
    articleId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    article?: ArticleOrderByWithRelationInput
  }

  export type ArticleLikeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    articleId_userId?: ArticleLikeArticleIdUserIdCompoundUniqueInput
    AND?: ArticleLikeWhereInput | ArticleLikeWhereInput[]
    OR?: ArticleLikeWhereInput[]
    NOT?: ArticleLikeWhereInput | ArticleLikeWhereInput[]
    articleId?: StringFilter<"ArticleLike"> | string
    userId?: StringFilter<"ArticleLike"> | string
    createdAt?: DateTimeFilter<"ArticleLike"> | Date | string
    article?: XOR<ArticleScalarRelationFilter, ArticleWhereInput>
  }, "id" | "articleId_userId">

  export type ArticleLikeOrderByWithAggregationInput = {
    id?: SortOrder
    articleId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    _count?: ArticleLikeCountOrderByAggregateInput
    _max?: ArticleLikeMaxOrderByAggregateInput
    _min?: ArticleLikeMinOrderByAggregateInput
  }

  export type ArticleLikeScalarWhereWithAggregatesInput = {
    AND?: ArticleLikeScalarWhereWithAggregatesInput | ArticleLikeScalarWhereWithAggregatesInput[]
    OR?: ArticleLikeScalarWhereWithAggregatesInput[]
    NOT?: ArticleLikeScalarWhereWithAggregatesInput | ArticleLikeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ArticleLike"> | string
    articleId?: StringWithAggregatesFilter<"ArticleLike"> | string
    userId?: StringWithAggregatesFilter<"ArticleLike"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ArticleLike"> | Date | string
  }

  export type ArticleViewWhereInput = {
    AND?: ArticleViewWhereInput | ArticleViewWhereInput[]
    OR?: ArticleViewWhereInput[]
    NOT?: ArticleViewWhereInput | ArticleViewWhereInput[]
    id?: StringFilter<"ArticleView"> | string
    articleId?: StringFilter<"ArticleView"> | string
    userId?: StringFilter<"ArticleView"> | string
    duration?: IntNullableFilter<"ArticleView"> | number | null
    viewedAt?: DateTimeFilter<"ArticleView"> | Date | string
    article?: XOR<ArticleScalarRelationFilter, ArticleWhereInput>
  }

  export type ArticleViewOrderByWithRelationInput = {
    id?: SortOrder
    articleId?: SortOrder
    userId?: SortOrder
    duration?: SortOrderInput | SortOrder
    viewedAt?: SortOrder
    article?: ArticleOrderByWithRelationInput
  }

  export type ArticleViewWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    articleId_userId?: ArticleViewArticleIdUserIdCompoundUniqueInput
    AND?: ArticleViewWhereInput | ArticleViewWhereInput[]
    OR?: ArticleViewWhereInput[]
    NOT?: ArticleViewWhereInput | ArticleViewWhereInput[]
    articleId?: StringFilter<"ArticleView"> | string
    userId?: StringFilter<"ArticleView"> | string
    duration?: IntNullableFilter<"ArticleView"> | number | null
    viewedAt?: DateTimeFilter<"ArticleView"> | Date | string
    article?: XOR<ArticleScalarRelationFilter, ArticleWhereInput>
  }, "id" | "articleId_userId">

  export type ArticleViewOrderByWithAggregationInput = {
    id?: SortOrder
    articleId?: SortOrder
    userId?: SortOrder
    duration?: SortOrderInput | SortOrder
    viewedAt?: SortOrder
    _count?: ArticleViewCountOrderByAggregateInput
    _avg?: ArticleViewAvgOrderByAggregateInput
    _max?: ArticleViewMaxOrderByAggregateInput
    _min?: ArticleViewMinOrderByAggregateInput
    _sum?: ArticleViewSumOrderByAggregateInput
  }

  export type ArticleViewScalarWhereWithAggregatesInput = {
    AND?: ArticleViewScalarWhereWithAggregatesInput | ArticleViewScalarWhereWithAggregatesInput[]
    OR?: ArticleViewScalarWhereWithAggregatesInput[]
    NOT?: ArticleViewScalarWhereWithAggregatesInput | ArticleViewScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ArticleView"> | string
    articleId?: StringWithAggregatesFilter<"ArticleView"> | string
    userId?: StringWithAggregatesFilter<"ArticleView"> | string
    duration?: IntNullableWithAggregatesFilter<"ArticleView"> | number | null
    viewedAt?: DateTimeWithAggregatesFilter<"ArticleView"> | Date | string
  }

  export type ArticleAttachmentWhereInput = {
    AND?: ArticleAttachmentWhereInput | ArticleAttachmentWhereInput[]
    OR?: ArticleAttachmentWhereInput[]
    NOT?: ArticleAttachmentWhereInput | ArticleAttachmentWhereInput[]
    id?: StringFilter<"ArticleAttachment"> | string
    articleId?: StringFilter<"ArticleAttachment"> | string
    filename?: StringFilter<"ArticleAttachment"> | string
    originalName?: StringFilter<"ArticleAttachment"> | string
    mimeType?: StringFilter<"ArticleAttachment"> | string
    size?: IntFilter<"ArticleAttachment"> | number
    url?: StringFilter<"ArticleAttachment"> | string
    createdAt?: DateTimeFilter<"ArticleAttachment"> | Date | string
    article?: XOR<ArticleScalarRelationFilter, ArticleWhereInput>
  }

  export type ArticleAttachmentOrderByWithRelationInput = {
    id?: SortOrder
    articleId?: SortOrder
    filename?: SortOrder
    originalName?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
    article?: ArticleOrderByWithRelationInput
  }

  export type ArticleAttachmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ArticleAttachmentWhereInput | ArticleAttachmentWhereInput[]
    OR?: ArticleAttachmentWhereInput[]
    NOT?: ArticleAttachmentWhereInput | ArticleAttachmentWhereInput[]
    articleId?: StringFilter<"ArticleAttachment"> | string
    filename?: StringFilter<"ArticleAttachment"> | string
    originalName?: StringFilter<"ArticleAttachment"> | string
    mimeType?: StringFilter<"ArticleAttachment"> | string
    size?: IntFilter<"ArticleAttachment"> | number
    url?: StringFilter<"ArticleAttachment"> | string
    createdAt?: DateTimeFilter<"ArticleAttachment"> | Date | string
    article?: XOR<ArticleScalarRelationFilter, ArticleWhereInput>
  }, "id">

  export type ArticleAttachmentOrderByWithAggregationInput = {
    id?: SortOrder
    articleId?: SortOrder
    filename?: SortOrder
    originalName?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
    _count?: ArticleAttachmentCountOrderByAggregateInput
    _avg?: ArticleAttachmentAvgOrderByAggregateInput
    _max?: ArticleAttachmentMaxOrderByAggregateInput
    _min?: ArticleAttachmentMinOrderByAggregateInput
    _sum?: ArticleAttachmentSumOrderByAggregateInput
  }

  export type ArticleAttachmentScalarWhereWithAggregatesInput = {
    AND?: ArticleAttachmentScalarWhereWithAggregatesInput | ArticleAttachmentScalarWhereWithAggregatesInput[]
    OR?: ArticleAttachmentScalarWhereWithAggregatesInput[]
    NOT?: ArticleAttachmentScalarWhereWithAggregatesInput | ArticleAttachmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ArticleAttachment"> | string
    articleId?: StringWithAggregatesFilter<"ArticleAttachment"> | string
    filename?: StringWithAggregatesFilter<"ArticleAttachment"> | string
    originalName?: StringWithAggregatesFilter<"ArticleAttachment"> | string
    mimeType?: StringWithAggregatesFilter<"ArticleAttachment"> | string
    size?: IntWithAggregatesFilter<"ArticleAttachment"> | number
    url?: StringWithAggregatesFilter<"ArticleAttachment"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ArticleAttachment"> | Date | string
  }

  export type TemplateWhereInput = {
    AND?: TemplateWhereInput | TemplateWhereInput[]
    OR?: TemplateWhereInput[]
    NOT?: TemplateWhereInput | TemplateWhereInput[]
    id?: StringFilter<"Template"> | string
    name?: StringFilter<"Template"> | string
    description?: StringNullableFilter<"Template"> | string | null
    content?: StringFilter<"Template"> | string
    categoryId?: StringFilter<"Template"> | string
    authorId?: StringFilter<"Template"> | string
    type?: EnumTemplateTypeFilter<"Template"> | $Enums.TemplateType
    tags?: StringNullableFilter<"Template"> | string | null
    variables?: StringNullableFilter<"Template"> | string | null
    useCount?: IntFilter<"Template"> | number
    isActive?: BoolFilter<"Template"> | boolean
    createdAt?: DateTimeFilter<"Template"> | Date | string
    updatedAt?: DateTimeFilter<"Template"> | Date | string
    category?: XOR<KnowledgeCategoryScalarRelationFilter, KnowledgeCategoryWhereInput>
  }

  export type TemplateOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    content?: SortOrder
    categoryId?: SortOrder
    authorId?: SortOrder
    type?: SortOrder
    tags?: SortOrderInput | SortOrder
    variables?: SortOrderInput | SortOrder
    useCount?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    category?: KnowledgeCategoryOrderByWithRelationInput
  }

  export type TemplateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TemplateWhereInput | TemplateWhereInput[]
    OR?: TemplateWhereInput[]
    NOT?: TemplateWhereInput | TemplateWhereInput[]
    name?: StringFilter<"Template"> | string
    description?: StringNullableFilter<"Template"> | string | null
    content?: StringFilter<"Template"> | string
    categoryId?: StringFilter<"Template"> | string
    authorId?: StringFilter<"Template"> | string
    type?: EnumTemplateTypeFilter<"Template"> | $Enums.TemplateType
    tags?: StringNullableFilter<"Template"> | string | null
    variables?: StringNullableFilter<"Template"> | string | null
    useCount?: IntFilter<"Template"> | number
    isActive?: BoolFilter<"Template"> | boolean
    createdAt?: DateTimeFilter<"Template"> | Date | string
    updatedAt?: DateTimeFilter<"Template"> | Date | string
    category?: XOR<KnowledgeCategoryScalarRelationFilter, KnowledgeCategoryWhereInput>
  }, "id">

  export type TemplateOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    content?: SortOrder
    categoryId?: SortOrder
    authorId?: SortOrder
    type?: SortOrder
    tags?: SortOrderInput | SortOrder
    variables?: SortOrderInput | SortOrder
    useCount?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TemplateCountOrderByAggregateInput
    _avg?: TemplateAvgOrderByAggregateInput
    _max?: TemplateMaxOrderByAggregateInput
    _min?: TemplateMinOrderByAggregateInput
    _sum?: TemplateSumOrderByAggregateInput
  }

  export type TemplateScalarWhereWithAggregatesInput = {
    AND?: TemplateScalarWhereWithAggregatesInput | TemplateScalarWhereWithAggregatesInput[]
    OR?: TemplateScalarWhereWithAggregatesInput[]
    NOT?: TemplateScalarWhereWithAggregatesInput | TemplateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Template"> | string
    name?: StringWithAggregatesFilter<"Template"> | string
    description?: StringNullableWithAggregatesFilter<"Template"> | string | null
    content?: StringWithAggregatesFilter<"Template"> | string
    categoryId?: StringWithAggregatesFilter<"Template"> | string
    authorId?: StringWithAggregatesFilter<"Template"> | string
    type?: EnumTemplateTypeWithAggregatesFilter<"Template"> | $Enums.TemplateType
    tags?: StringNullableWithAggregatesFilter<"Template"> | string | null
    variables?: StringNullableWithAggregatesFilter<"Template"> | string | null
    useCount?: IntWithAggregatesFilter<"Template"> | number
    isActive?: BoolWithAggregatesFilter<"Template"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Template"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Template"> | Date | string
  }

  export type FAQWhereInput = {
    AND?: FAQWhereInput | FAQWhereInput[]
    OR?: FAQWhereInput[]
    NOT?: FAQWhereInput | FAQWhereInput[]
    id?: StringFilter<"FAQ"> | string
    question?: StringFilter<"FAQ"> | string
    answer?: StringFilter<"FAQ"> | string
    categoryId?: StringFilter<"FAQ"> | string
    authorId?: StringFilter<"FAQ"> | string
    viewCount?: IntFilter<"FAQ"> | number
    helpfulCount?: IntFilter<"FAQ"> | number
    isActive?: BoolFilter<"FAQ"> | boolean
    createdAt?: DateTimeFilter<"FAQ"> | Date | string
    updatedAt?: DateTimeFilter<"FAQ"> | Date | string
    category?: XOR<KnowledgeCategoryScalarRelationFilter, KnowledgeCategoryWhereInput>
    feedback?: FAQFeedbackListRelationFilter
  }

  export type FAQOrderByWithRelationInput = {
    id?: SortOrder
    question?: SortOrder
    answer?: SortOrder
    categoryId?: SortOrder
    authorId?: SortOrder
    viewCount?: SortOrder
    helpfulCount?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    category?: KnowledgeCategoryOrderByWithRelationInput
    feedback?: FAQFeedbackOrderByRelationAggregateInput
  }

  export type FAQWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FAQWhereInput | FAQWhereInput[]
    OR?: FAQWhereInput[]
    NOT?: FAQWhereInput | FAQWhereInput[]
    question?: StringFilter<"FAQ"> | string
    answer?: StringFilter<"FAQ"> | string
    categoryId?: StringFilter<"FAQ"> | string
    authorId?: StringFilter<"FAQ"> | string
    viewCount?: IntFilter<"FAQ"> | number
    helpfulCount?: IntFilter<"FAQ"> | number
    isActive?: BoolFilter<"FAQ"> | boolean
    createdAt?: DateTimeFilter<"FAQ"> | Date | string
    updatedAt?: DateTimeFilter<"FAQ"> | Date | string
    category?: XOR<KnowledgeCategoryScalarRelationFilter, KnowledgeCategoryWhereInput>
    feedback?: FAQFeedbackListRelationFilter
  }, "id">

  export type FAQOrderByWithAggregationInput = {
    id?: SortOrder
    question?: SortOrder
    answer?: SortOrder
    categoryId?: SortOrder
    authorId?: SortOrder
    viewCount?: SortOrder
    helpfulCount?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FAQCountOrderByAggregateInput
    _avg?: FAQAvgOrderByAggregateInput
    _max?: FAQMaxOrderByAggregateInput
    _min?: FAQMinOrderByAggregateInput
    _sum?: FAQSumOrderByAggregateInput
  }

  export type FAQScalarWhereWithAggregatesInput = {
    AND?: FAQScalarWhereWithAggregatesInput | FAQScalarWhereWithAggregatesInput[]
    OR?: FAQScalarWhereWithAggregatesInput[]
    NOT?: FAQScalarWhereWithAggregatesInput | FAQScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FAQ"> | string
    question?: StringWithAggregatesFilter<"FAQ"> | string
    answer?: StringWithAggregatesFilter<"FAQ"> | string
    categoryId?: StringWithAggregatesFilter<"FAQ"> | string
    authorId?: StringWithAggregatesFilter<"FAQ"> | string
    viewCount?: IntWithAggregatesFilter<"FAQ"> | number
    helpfulCount?: IntWithAggregatesFilter<"FAQ"> | number
    isActive?: BoolWithAggregatesFilter<"FAQ"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"FAQ"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"FAQ"> | Date | string
  }

  export type FAQFeedbackWhereInput = {
    AND?: FAQFeedbackWhereInput | FAQFeedbackWhereInput[]
    OR?: FAQFeedbackWhereInput[]
    NOT?: FAQFeedbackWhereInput | FAQFeedbackWhereInput[]
    id?: StringFilter<"FAQFeedback"> | string
    faqId?: StringFilter<"FAQFeedback"> | string
    userId?: StringFilter<"FAQFeedback"> | string
    isHelpful?: BoolFilter<"FAQFeedback"> | boolean
    comment?: StringNullableFilter<"FAQFeedback"> | string | null
    createdAt?: DateTimeFilter<"FAQFeedback"> | Date | string
    faq?: XOR<FAQScalarRelationFilter, FAQWhereInput>
  }

  export type FAQFeedbackOrderByWithRelationInput = {
    id?: SortOrder
    faqId?: SortOrder
    userId?: SortOrder
    isHelpful?: SortOrder
    comment?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    faq?: FAQOrderByWithRelationInput
  }

  export type FAQFeedbackWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    faqId_userId?: FAQFeedbackFaqIdUserIdCompoundUniqueInput
    AND?: FAQFeedbackWhereInput | FAQFeedbackWhereInput[]
    OR?: FAQFeedbackWhereInput[]
    NOT?: FAQFeedbackWhereInput | FAQFeedbackWhereInput[]
    faqId?: StringFilter<"FAQFeedback"> | string
    userId?: StringFilter<"FAQFeedback"> | string
    isHelpful?: BoolFilter<"FAQFeedback"> | boolean
    comment?: StringNullableFilter<"FAQFeedback"> | string | null
    createdAt?: DateTimeFilter<"FAQFeedback"> | Date | string
    faq?: XOR<FAQScalarRelationFilter, FAQWhereInput>
  }, "id" | "faqId_userId">

  export type FAQFeedbackOrderByWithAggregationInput = {
    id?: SortOrder
    faqId?: SortOrder
    userId?: SortOrder
    isHelpful?: SortOrder
    comment?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: FAQFeedbackCountOrderByAggregateInput
    _max?: FAQFeedbackMaxOrderByAggregateInput
    _min?: FAQFeedbackMinOrderByAggregateInput
  }

  export type FAQFeedbackScalarWhereWithAggregatesInput = {
    AND?: FAQFeedbackScalarWhereWithAggregatesInput | FAQFeedbackScalarWhereWithAggregatesInput[]
    OR?: FAQFeedbackScalarWhereWithAggregatesInput[]
    NOT?: FAQFeedbackScalarWhereWithAggregatesInput | FAQFeedbackScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FAQFeedback"> | string
    faqId?: StringWithAggregatesFilter<"FAQFeedback"> | string
    userId?: StringWithAggregatesFilter<"FAQFeedback"> | string
    isHelpful?: BoolWithAggregatesFilter<"FAQFeedback"> | boolean
    comment?: StringNullableWithAggregatesFilter<"FAQFeedback"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"FAQFeedback"> | Date | string
  }

  export type ExpertWhereInput = {
    AND?: ExpertWhereInput | ExpertWhereInput[]
    OR?: ExpertWhereInput[]
    NOT?: ExpertWhereInput | ExpertWhereInput[]
    id?: StringFilter<"Expert"> | string
    userId?: StringFilter<"Expert"> | string
    bio?: StringNullableFilter<"Expert"> | string | null
    specialties?: StringFilter<"Expert"> | string
    certifications?: StringNullableFilter<"Expert"> | string | null
    experience?: StringNullableFilter<"Expert"> | string | null
    contactInfo?: StringNullableFilter<"Expert"> | string | null
    rating?: FloatFilter<"Expert"> | number
    reviewCount?: IntFilter<"Expert"> | number
    isActive?: BoolFilter<"Expert"> | boolean
    createdAt?: DateTimeFilter<"Expert"> | Date | string
    updatedAt?: DateTimeFilter<"Expert"> | Date | string
    reviews?: ExpertReviewListRelationFilter
  }

  export type ExpertOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    bio?: SortOrderInput | SortOrder
    specialties?: SortOrder
    certifications?: SortOrderInput | SortOrder
    experience?: SortOrderInput | SortOrder
    contactInfo?: SortOrderInput | SortOrder
    rating?: SortOrder
    reviewCount?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    reviews?: ExpertReviewOrderByRelationAggregateInput
  }

  export type ExpertWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: ExpertWhereInput | ExpertWhereInput[]
    OR?: ExpertWhereInput[]
    NOT?: ExpertWhereInput | ExpertWhereInput[]
    bio?: StringNullableFilter<"Expert"> | string | null
    specialties?: StringFilter<"Expert"> | string
    certifications?: StringNullableFilter<"Expert"> | string | null
    experience?: StringNullableFilter<"Expert"> | string | null
    contactInfo?: StringNullableFilter<"Expert"> | string | null
    rating?: FloatFilter<"Expert"> | number
    reviewCount?: IntFilter<"Expert"> | number
    isActive?: BoolFilter<"Expert"> | boolean
    createdAt?: DateTimeFilter<"Expert"> | Date | string
    updatedAt?: DateTimeFilter<"Expert"> | Date | string
    reviews?: ExpertReviewListRelationFilter
  }, "id" | "userId">

  export type ExpertOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    bio?: SortOrderInput | SortOrder
    specialties?: SortOrder
    certifications?: SortOrderInput | SortOrder
    experience?: SortOrderInput | SortOrder
    contactInfo?: SortOrderInput | SortOrder
    rating?: SortOrder
    reviewCount?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ExpertCountOrderByAggregateInput
    _avg?: ExpertAvgOrderByAggregateInput
    _max?: ExpertMaxOrderByAggregateInput
    _min?: ExpertMinOrderByAggregateInput
    _sum?: ExpertSumOrderByAggregateInput
  }

  export type ExpertScalarWhereWithAggregatesInput = {
    AND?: ExpertScalarWhereWithAggregatesInput | ExpertScalarWhereWithAggregatesInput[]
    OR?: ExpertScalarWhereWithAggregatesInput[]
    NOT?: ExpertScalarWhereWithAggregatesInput | ExpertScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Expert"> | string
    userId?: StringWithAggregatesFilter<"Expert"> | string
    bio?: StringNullableWithAggregatesFilter<"Expert"> | string | null
    specialties?: StringWithAggregatesFilter<"Expert"> | string
    certifications?: StringNullableWithAggregatesFilter<"Expert"> | string | null
    experience?: StringNullableWithAggregatesFilter<"Expert"> | string | null
    contactInfo?: StringNullableWithAggregatesFilter<"Expert"> | string | null
    rating?: FloatWithAggregatesFilter<"Expert"> | number
    reviewCount?: IntWithAggregatesFilter<"Expert"> | number
    isActive?: BoolWithAggregatesFilter<"Expert"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Expert"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Expert"> | Date | string
  }

  export type ExpertReviewWhereInput = {
    AND?: ExpertReviewWhereInput | ExpertReviewWhereInput[]
    OR?: ExpertReviewWhereInput[]
    NOT?: ExpertReviewWhereInput | ExpertReviewWhereInput[]
    id?: StringFilter<"ExpertReview"> | string
    expertId?: StringFilter<"ExpertReview"> | string
    reviewerId?: StringFilter<"ExpertReview"> | string
    rating?: IntFilter<"ExpertReview"> | number
    comment?: StringNullableFilter<"ExpertReview"> | string | null
    createdAt?: DateTimeFilter<"ExpertReview"> | Date | string
    expert?: XOR<ExpertScalarRelationFilter, ExpertWhereInput>
  }

  export type ExpertReviewOrderByWithRelationInput = {
    id?: SortOrder
    expertId?: SortOrder
    reviewerId?: SortOrder
    rating?: SortOrder
    comment?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    expert?: ExpertOrderByWithRelationInput
  }

  export type ExpertReviewWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    expertId_reviewerId?: ExpertReviewExpertIdReviewerIdCompoundUniqueInput
    AND?: ExpertReviewWhereInput | ExpertReviewWhereInput[]
    OR?: ExpertReviewWhereInput[]
    NOT?: ExpertReviewWhereInput | ExpertReviewWhereInput[]
    expertId?: StringFilter<"ExpertReview"> | string
    reviewerId?: StringFilter<"ExpertReview"> | string
    rating?: IntFilter<"ExpertReview"> | number
    comment?: StringNullableFilter<"ExpertReview"> | string | null
    createdAt?: DateTimeFilter<"ExpertReview"> | Date | string
    expert?: XOR<ExpertScalarRelationFilter, ExpertWhereInput>
  }, "id" | "expertId_reviewerId">

  export type ExpertReviewOrderByWithAggregationInput = {
    id?: SortOrder
    expertId?: SortOrder
    reviewerId?: SortOrder
    rating?: SortOrder
    comment?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ExpertReviewCountOrderByAggregateInput
    _avg?: ExpertReviewAvgOrderByAggregateInput
    _max?: ExpertReviewMaxOrderByAggregateInput
    _min?: ExpertReviewMinOrderByAggregateInput
    _sum?: ExpertReviewSumOrderByAggregateInput
  }

  export type ExpertReviewScalarWhereWithAggregatesInput = {
    AND?: ExpertReviewScalarWhereWithAggregatesInput | ExpertReviewScalarWhereWithAggregatesInput[]
    OR?: ExpertReviewScalarWhereWithAggregatesInput[]
    NOT?: ExpertReviewScalarWhereWithAggregatesInput | ExpertReviewScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ExpertReview"> | string
    expertId?: StringWithAggregatesFilter<"ExpertReview"> | string
    reviewerId?: StringWithAggregatesFilter<"ExpertReview"> | string
    rating?: IntWithAggregatesFilter<"ExpertReview"> | number
    comment?: StringNullableWithAggregatesFilter<"ExpertReview"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ExpertReview"> | Date | string
  }

  export type SearchLogWhereInput = {
    AND?: SearchLogWhereInput | SearchLogWhereInput[]
    OR?: SearchLogWhereInput[]
    NOT?: SearchLogWhereInput | SearchLogWhereInput[]
    id?: StringFilter<"SearchLog"> | string
    userId?: StringFilter<"SearchLog"> | string
    query?: StringFilter<"SearchLog"> | string
    results?: IntFilter<"SearchLog"> | number
    clicked?: StringNullableFilter<"SearchLog"> | string | null
    searchedAt?: DateTimeFilter<"SearchLog"> | Date | string
  }

  export type SearchLogOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    query?: SortOrder
    results?: SortOrder
    clicked?: SortOrderInput | SortOrder
    searchedAt?: SortOrder
  }

  export type SearchLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SearchLogWhereInput | SearchLogWhereInput[]
    OR?: SearchLogWhereInput[]
    NOT?: SearchLogWhereInput | SearchLogWhereInput[]
    userId?: StringFilter<"SearchLog"> | string
    query?: StringFilter<"SearchLog"> | string
    results?: IntFilter<"SearchLog"> | number
    clicked?: StringNullableFilter<"SearchLog"> | string | null
    searchedAt?: DateTimeFilter<"SearchLog"> | Date | string
  }, "id">

  export type SearchLogOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    query?: SortOrder
    results?: SortOrder
    clicked?: SortOrderInput | SortOrder
    searchedAt?: SortOrder
    _count?: SearchLogCountOrderByAggregateInput
    _avg?: SearchLogAvgOrderByAggregateInput
    _max?: SearchLogMaxOrderByAggregateInput
    _min?: SearchLogMinOrderByAggregateInput
    _sum?: SearchLogSumOrderByAggregateInput
  }

  export type SearchLogScalarWhereWithAggregatesInput = {
    AND?: SearchLogScalarWhereWithAggregatesInput | SearchLogScalarWhereWithAggregatesInput[]
    OR?: SearchLogScalarWhereWithAggregatesInput[]
    NOT?: SearchLogScalarWhereWithAggregatesInput | SearchLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SearchLog"> | string
    userId?: StringWithAggregatesFilter<"SearchLog"> | string
    query?: StringWithAggregatesFilter<"SearchLog"> | string
    results?: IntWithAggregatesFilter<"SearchLog"> | number
    clicked?: StringNullableWithAggregatesFilter<"SearchLog"> | string | null
    searchedAt?: DateTimeWithAggregatesFilter<"SearchLog"> | Date | string
  }

  export type KnowledgeCategoryCreateInput = {
    id?: string
    name: string
    description?: string | null
    icon?: string | null
    color?: string | null
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    parent?: KnowledgeCategoryCreateNestedOneWithoutChildrenInput
    children?: KnowledgeCategoryCreateNestedManyWithoutParentInput
    articles?: ArticleCreateNestedManyWithoutCategoryInput
    templates?: TemplateCreateNestedManyWithoutCategoryInput
    faqs?: FAQCreateNestedManyWithoutCategoryInput
  }

  export type KnowledgeCategoryUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    icon?: string | null
    color?: string | null
    order?: number
    parentId?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: KnowledgeCategoryUncheckedCreateNestedManyWithoutParentInput
    articles?: ArticleUncheckedCreateNestedManyWithoutCategoryInput
    templates?: TemplateUncheckedCreateNestedManyWithoutCategoryInput
    faqs?: FAQUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type KnowledgeCategoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: KnowledgeCategoryUpdateOneWithoutChildrenNestedInput
    children?: KnowledgeCategoryUpdateManyWithoutParentNestedInput
    articles?: ArticleUpdateManyWithoutCategoryNestedInput
    templates?: TemplateUpdateManyWithoutCategoryNestedInput
    faqs?: FAQUpdateManyWithoutCategoryNestedInput
  }

  export type KnowledgeCategoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: KnowledgeCategoryUncheckedUpdateManyWithoutParentNestedInput
    articles?: ArticleUncheckedUpdateManyWithoutCategoryNestedInput
    templates?: TemplateUncheckedUpdateManyWithoutCategoryNestedInput
    faqs?: FAQUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type KnowledgeCategoryCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    icon?: string | null
    color?: string | null
    order?: number
    parentId?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KnowledgeCategoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KnowledgeCategoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleCreateInput = {
    id?: string
    title: string
    content: string
    summary?: string | null
    authorId: string
    status?: $Enums.ArticleStatus
    visibility?: $Enums.ArticleVisibility
    tags?: string | null
    keywords?: string | null
    estimatedReadTime?: number | null
    difficulty?: $Enums.DifficultyLevel
    viewCount?: number
    likeCount?: number
    reviewerId?: string | null
    reviewedAt?: Date | string | null
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    category: KnowledgeCategoryCreateNestedOneWithoutArticlesInput
    comments?: ArticleCommentCreateNestedManyWithoutArticleInput
    likes?: ArticleLikeCreateNestedManyWithoutArticleInput
    views?: ArticleViewCreateNestedManyWithoutArticleInput
    revisions?: ArticleRevisionCreateNestedManyWithoutArticleInput
    attachments?: ArticleAttachmentCreateNestedManyWithoutArticleInput
  }

  export type ArticleUncheckedCreateInput = {
    id?: string
    title: string
    content: string
    summary?: string | null
    categoryId: string
    authorId: string
    status?: $Enums.ArticleStatus
    visibility?: $Enums.ArticleVisibility
    tags?: string | null
    keywords?: string | null
    estimatedReadTime?: number | null
    difficulty?: $Enums.DifficultyLevel
    viewCount?: number
    likeCount?: number
    reviewerId?: string | null
    reviewedAt?: Date | string | null
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    comments?: ArticleCommentUncheckedCreateNestedManyWithoutArticleInput
    likes?: ArticleLikeUncheckedCreateNestedManyWithoutArticleInput
    views?: ArticleViewUncheckedCreateNestedManyWithoutArticleInput
    revisions?: ArticleRevisionUncheckedCreateNestedManyWithoutArticleInput
    attachments?: ArticleAttachmentUncheckedCreateNestedManyWithoutArticleInput
  }

  export type ArticleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    authorId?: StringFieldUpdateOperationsInput | string
    status?: EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus
    visibility?: EnumArticleVisibilityFieldUpdateOperationsInput | $Enums.ArticleVisibility
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedReadTime?: NullableIntFieldUpdateOperationsInput | number | null
    difficulty?: EnumDifficultyLevelFieldUpdateOperationsInput | $Enums.DifficultyLevel
    viewCount?: IntFieldUpdateOperationsInput | number
    likeCount?: IntFieldUpdateOperationsInput | number
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: KnowledgeCategoryUpdateOneRequiredWithoutArticlesNestedInput
    comments?: ArticleCommentUpdateManyWithoutArticleNestedInput
    likes?: ArticleLikeUpdateManyWithoutArticleNestedInput
    views?: ArticleViewUpdateManyWithoutArticleNestedInput
    revisions?: ArticleRevisionUpdateManyWithoutArticleNestedInput
    attachments?: ArticleAttachmentUpdateManyWithoutArticleNestedInput
  }

  export type ArticleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    categoryId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    status?: EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus
    visibility?: EnumArticleVisibilityFieldUpdateOperationsInput | $Enums.ArticleVisibility
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedReadTime?: NullableIntFieldUpdateOperationsInput | number | null
    difficulty?: EnumDifficultyLevelFieldUpdateOperationsInput | $Enums.DifficultyLevel
    viewCount?: IntFieldUpdateOperationsInput | number
    likeCount?: IntFieldUpdateOperationsInput | number
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: ArticleCommentUncheckedUpdateManyWithoutArticleNestedInput
    likes?: ArticleLikeUncheckedUpdateManyWithoutArticleNestedInput
    views?: ArticleViewUncheckedUpdateManyWithoutArticleNestedInput
    revisions?: ArticleRevisionUncheckedUpdateManyWithoutArticleNestedInput
    attachments?: ArticleAttachmentUncheckedUpdateManyWithoutArticleNestedInput
  }

  export type ArticleCreateManyInput = {
    id?: string
    title: string
    content: string
    summary?: string | null
    categoryId: string
    authorId: string
    status?: $Enums.ArticleStatus
    visibility?: $Enums.ArticleVisibility
    tags?: string | null
    keywords?: string | null
    estimatedReadTime?: number | null
    difficulty?: $Enums.DifficultyLevel
    viewCount?: number
    likeCount?: number
    reviewerId?: string | null
    reviewedAt?: Date | string | null
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ArticleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    authorId?: StringFieldUpdateOperationsInput | string
    status?: EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus
    visibility?: EnumArticleVisibilityFieldUpdateOperationsInput | $Enums.ArticleVisibility
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedReadTime?: NullableIntFieldUpdateOperationsInput | number | null
    difficulty?: EnumDifficultyLevelFieldUpdateOperationsInput | $Enums.DifficultyLevel
    viewCount?: IntFieldUpdateOperationsInput | number
    likeCount?: IntFieldUpdateOperationsInput | number
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    categoryId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    status?: EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus
    visibility?: EnumArticleVisibilityFieldUpdateOperationsInput | $Enums.ArticleVisibility
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedReadTime?: NullableIntFieldUpdateOperationsInput | number | null
    difficulty?: EnumDifficultyLevelFieldUpdateOperationsInput | $Enums.DifficultyLevel
    viewCount?: IntFieldUpdateOperationsInput | number
    likeCount?: IntFieldUpdateOperationsInput | number
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleRevisionCreateInput = {
    id?: string
    version: number
    title: string
    content: string
    summary?: string | null
    changes?: string | null
    authorId: string
    createdAt?: Date | string
    article: ArticleCreateNestedOneWithoutRevisionsInput
  }

  export type ArticleRevisionUncheckedCreateInput = {
    id?: string
    articleId: string
    version: number
    title: string
    content: string
    summary?: string | null
    changes?: string | null
    authorId: string
    createdAt?: Date | string
  }

  export type ArticleRevisionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    changes?: NullableStringFieldUpdateOperationsInput | string | null
    authorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    article?: ArticleUpdateOneRequiredWithoutRevisionsNestedInput
  }

  export type ArticleRevisionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    changes?: NullableStringFieldUpdateOperationsInput | string | null
    authorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleRevisionCreateManyInput = {
    id?: string
    articleId: string
    version: number
    title: string
    content: string
    summary?: string | null
    changes?: string | null
    authorId: string
    createdAt?: Date | string
  }

  export type ArticleRevisionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    changes?: NullableStringFieldUpdateOperationsInput | string | null
    authorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleRevisionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    changes?: NullableStringFieldUpdateOperationsInput | string | null
    authorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleCommentCreateInput = {
    id?: string
    authorId: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    article: ArticleCreateNestedOneWithoutCommentsInput
    parent?: ArticleCommentCreateNestedOneWithoutRepliesInput
    replies?: ArticleCommentCreateNestedManyWithoutParentInput
  }

  export type ArticleCommentUncheckedCreateInput = {
    id?: string
    articleId: string
    authorId: string
    content: string
    parentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    replies?: ArticleCommentUncheckedCreateNestedManyWithoutParentInput
  }

  export type ArticleCommentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    article?: ArticleUpdateOneRequiredWithoutCommentsNestedInput
    parent?: ArticleCommentUpdateOneWithoutRepliesNestedInput
    replies?: ArticleCommentUpdateManyWithoutParentNestedInput
  }

  export type ArticleCommentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: ArticleCommentUncheckedUpdateManyWithoutParentNestedInput
  }

  export type ArticleCommentCreateManyInput = {
    id?: string
    articleId: string
    authorId: string
    content: string
    parentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ArticleCommentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleCommentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleLikeCreateInput = {
    id?: string
    userId: string
    createdAt?: Date | string
    article: ArticleCreateNestedOneWithoutLikesInput
  }

  export type ArticleLikeUncheckedCreateInput = {
    id?: string
    articleId: string
    userId: string
    createdAt?: Date | string
  }

  export type ArticleLikeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    article?: ArticleUpdateOneRequiredWithoutLikesNestedInput
  }

  export type ArticleLikeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleLikeCreateManyInput = {
    id?: string
    articleId: string
    userId: string
    createdAt?: Date | string
  }

  export type ArticleLikeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleLikeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleViewCreateInput = {
    id?: string
    userId: string
    duration?: number | null
    viewedAt?: Date | string
    article: ArticleCreateNestedOneWithoutViewsInput
  }

  export type ArticleViewUncheckedCreateInput = {
    id?: string
    articleId: string
    userId: string
    duration?: number | null
    viewedAt?: Date | string
  }

  export type ArticleViewUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    article?: ArticleUpdateOneRequiredWithoutViewsNestedInput
  }

  export type ArticleViewUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleViewCreateManyInput = {
    id?: string
    articleId: string
    userId: string
    duration?: number | null
    viewedAt?: Date | string
  }

  export type ArticleViewUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleViewUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleAttachmentCreateInput = {
    id?: string
    filename: string
    originalName: string
    mimeType: string
    size: number
    url: string
    createdAt?: Date | string
    article: ArticleCreateNestedOneWithoutAttachmentsInput
  }

  export type ArticleAttachmentUncheckedCreateInput = {
    id?: string
    articleId: string
    filename: string
    originalName: string
    mimeType: string
    size: number
    url: string
    createdAt?: Date | string
  }

  export type ArticleAttachmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    article?: ArticleUpdateOneRequiredWithoutAttachmentsNestedInput
  }

  export type ArticleAttachmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleAttachmentCreateManyInput = {
    id?: string
    articleId: string
    filename: string
    originalName: string
    mimeType: string
    size: number
    url: string
    createdAt?: Date | string
  }

  export type ArticleAttachmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleAttachmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TemplateCreateInput = {
    id?: string
    name: string
    description?: string | null
    content: string
    authorId: string
    type: $Enums.TemplateType
    tags?: string | null
    variables?: string | null
    useCount?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    category: KnowledgeCategoryCreateNestedOneWithoutTemplatesInput
  }

  export type TemplateUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    content: string
    categoryId: string
    authorId: string
    type: $Enums.TemplateType
    tags?: string | null
    variables?: string | null
    useCount?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TemplateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    type?: EnumTemplateTypeFieldUpdateOperationsInput | $Enums.TemplateType
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    variables?: NullableStringFieldUpdateOperationsInput | string | null
    useCount?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: KnowledgeCategoryUpdateOneRequiredWithoutTemplatesNestedInput
  }

  export type TemplateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    type?: EnumTemplateTypeFieldUpdateOperationsInput | $Enums.TemplateType
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    variables?: NullableStringFieldUpdateOperationsInput | string | null
    useCount?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TemplateCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    content: string
    categoryId: string
    authorId: string
    type: $Enums.TemplateType
    tags?: string | null
    variables?: string | null
    useCount?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TemplateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    type?: EnumTemplateTypeFieldUpdateOperationsInput | $Enums.TemplateType
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    variables?: NullableStringFieldUpdateOperationsInput | string | null
    useCount?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TemplateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    type?: EnumTemplateTypeFieldUpdateOperationsInput | $Enums.TemplateType
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    variables?: NullableStringFieldUpdateOperationsInput | string | null
    useCount?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FAQCreateInput = {
    id?: string
    question: string
    answer: string
    authorId: string
    viewCount?: number
    helpfulCount?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    category: KnowledgeCategoryCreateNestedOneWithoutFaqsInput
    feedback?: FAQFeedbackCreateNestedManyWithoutFaqInput
  }

  export type FAQUncheckedCreateInput = {
    id?: string
    question: string
    answer: string
    categoryId: string
    authorId: string
    viewCount?: number
    helpfulCount?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    feedback?: FAQFeedbackUncheckedCreateNestedManyWithoutFaqInput
  }

  export type FAQUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    answer?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    viewCount?: IntFieldUpdateOperationsInput | number
    helpfulCount?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: KnowledgeCategoryUpdateOneRequiredWithoutFaqsNestedInput
    feedback?: FAQFeedbackUpdateManyWithoutFaqNestedInput
  }

  export type FAQUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    answer?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    viewCount?: IntFieldUpdateOperationsInput | number
    helpfulCount?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    feedback?: FAQFeedbackUncheckedUpdateManyWithoutFaqNestedInput
  }

  export type FAQCreateManyInput = {
    id?: string
    question: string
    answer: string
    categoryId: string
    authorId: string
    viewCount?: number
    helpfulCount?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FAQUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    answer?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    viewCount?: IntFieldUpdateOperationsInput | number
    helpfulCount?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FAQUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    answer?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    viewCount?: IntFieldUpdateOperationsInput | number
    helpfulCount?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FAQFeedbackCreateInput = {
    id?: string
    userId: string
    isHelpful: boolean
    comment?: string | null
    createdAt?: Date | string
    faq: FAQCreateNestedOneWithoutFeedbackInput
  }

  export type FAQFeedbackUncheckedCreateInput = {
    id?: string
    faqId: string
    userId: string
    isHelpful: boolean
    comment?: string | null
    createdAt?: Date | string
  }

  export type FAQFeedbackUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    isHelpful?: BoolFieldUpdateOperationsInput | boolean
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    faq?: FAQUpdateOneRequiredWithoutFeedbackNestedInput
  }

  export type FAQFeedbackUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    faqId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    isHelpful?: BoolFieldUpdateOperationsInput | boolean
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FAQFeedbackCreateManyInput = {
    id?: string
    faqId: string
    userId: string
    isHelpful: boolean
    comment?: string | null
    createdAt?: Date | string
  }

  export type FAQFeedbackUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    isHelpful?: BoolFieldUpdateOperationsInput | boolean
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FAQFeedbackUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    faqId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    isHelpful?: BoolFieldUpdateOperationsInput | boolean
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExpertCreateInput = {
    id?: string
    userId: string
    bio?: string | null
    specialties: string
    certifications?: string | null
    experience?: string | null
    contactInfo?: string | null
    rating?: number
    reviewCount?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    reviews?: ExpertReviewCreateNestedManyWithoutExpertInput
  }

  export type ExpertUncheckedCreateInput = {
    id?: string
    userId: string
    bio?: string | null
    specialties: string
    certifications?: string | null
    experience?: string | null
    contactInfo?: string | null
    rating?: number
    reviewCount?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    reviews?: ExpertReviewUncheckedCreateNestedManyWithoutExpertInput
  }

  export type ExpertUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    specialties?: StringFieldUpdateOperationsInput | string
    certifications?: NullableStringFieldUpdateOperationsInput | string | null
    experience?: NullableStringFieldUpdateOperationsInput | string | null
    contactInfo?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: FloatFieldUpdateOperationsInput | number
    reviewCount?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviews?: ExpertReviewUpdateManyWithoutExpertNestedInput
  }

  export type ExpertUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    specialties?: StringFieldUpdateOperationsInput | string
    certifications?: NullableStringFieldUpdateOperationsInput | string | null
    experience?: NullableStringFieldUpdateOperationsInput | string | null
    contactInfo?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: FloatFieldUpdateOperationsInput | number
    reviewCount?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviews?: ExpertReviewUncheckedUpdateManyWithoutExpertNestedInput
  }

  export type ExpertCreateManyInput = {
    id?: string
    userId: string
    bio?: string | null
    specialties: string
    certifications?: string | null
    experience?: string | null
    contactInfo?: string | null
    rating?: number
    reviewCount?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExpertUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    specialties?: StringFieldUpdateOperationsInput | string
    certifications?: NullableStringFieldUpdateOperationsInput | string | null
    experience?: NullableStringFieldUpdateOperationsInput | string | null
    contactInfo?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: FloatFieldUpdateOperationsInput | number
    reviewCount?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExpertUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    specialties?: StringFieldUpdateOperationsInput | string
    certifications?: NullableStringFieldUpdateOperationsInput | string | null
    experience?: NullableStringFieldUpdateOperationsInput | string | null
    contactInfo?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: FloatFieldUpdateOperationsInput | number
    reviewCount?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExpertReviewCreateInput = {
    id?: string
    reviewerId: string
    rating: number
    comment?: string | null
    createdAt?: Date | string
    expert: ExpertCreateNestedOneWithoutReviewsInput
  }

  export type ExpertReviewUncheckedCreateInput = {
    id?: string
    expertId: string
    reviewerId: string
    rating: number
    comment?: string | null
    createdAt?: Date | string
  }

  export type ExpertReviewUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    reviewerId?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expert?: ExpertUpdateOneRequiredWithoutReviewsNestedInput
  }

  export type ExpertReviewUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    expertId?: StringFieldUpdateOperationsInput | string
    reviewerId?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExpertReviewCreateManyInput = {
    id?: string
    expertId: string
    reviewerId: string
    rating: number
    comment?: string | null
    createdAt?: Date | string
  }

  export type ExpertReviewUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    reviewerId?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExpertReviewUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    expertId?: StringFieldUpdateOperationsInput | string
    reviewerId?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SearchLogCreateInput = {
    id?: string
    userId: string
    query: string
    results: number
    clicked?: string | null
    searchedAt?: Date | string
  }

  export type SearchLogUncheckedCreateInput = {
    id?: string
    userId: string
    query: string
    results: number
    clicked?: string | null
    searchedAt?: Date | string
  }

  export type SearchLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    results?: IntFieldUpdateOperationsInput | number
    clicked?: NullableStringFieldUpdateOperationsInput | string | null
    searchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SearchLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    results?: IntFieldUpdateOperationsInput | number
    clicked?: NullableStringFieldUpdateOperationsInput | string | null
    searchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SearchLogCreateManyInput = {
    id?: string
    userId: string
    query: string
    results: number
    clicked?: string | null
    searchedAt?: Date | string
  }

  export type SearchLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    results?: IntFieldUpdateOperationsInput | number
    clicked?: NullableStringFieldUpdateOperationsInput | string | null
    searchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SearchLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    results?: IntFieldUpdateOperationsInput | number
    clicked?: NullableStringFieldUpdateOperationsInput | string | null
    searchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type KnowledgeCategoryNullableScalarRelationFilter = {
    is?: KnowledgeCategoryWhereInput | null
    isNot?: KnowledgeCategoryWhereInput | null
  }

  export type KnowledgeCategoryListRelationFilter = {
    every?: KnowledgeCategoryWhereInput
    some?: KnowledgeCategoryWhereInput
    none?: KnowledgeCategoryWhereInput
  }

  export type ArticleListRelationFilter = {
    every?: ArticleWhereInput
    some?: ArticleWhereInput
    none?: ArticleWhereInput
  }

  export type TemplateListRelationFilter = {
    every?: TemplateWhereInput
    some?: TemplateWhereInput
    none?: TemplateWhereInput
  }

  export type FAQListRelationFilter = {
    every?: FAQWhereInput
    some?: FAQWhereInput
    none?: FAQWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type KnowledgeCategoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ArticleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TemplateOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FAQOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type KnowledgeCategoryCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    icon?: SortOrder
    color?: SortOrder
    order?: SortOrder
    parentId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KnowledgeCategoryAvgOrderByAggregateInput = {
    order?: SortOrder
  }

  export type KnowledgeCategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    icon?: SortOrder
    color?: SortOrder
    order?: SortOrder
    parentId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KnowledgeCategoryMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    icon?: SortOrder
    color?: SortOrder
    order?: SortOrder
    parentId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KnowledgeCategorySumOrderByAggregateInput = {
    order?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumArticleStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ArticleStatus | EnumArticleStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ArticleStatus[]
    notIn?: $Enums.ArticleStatus[]
    not?: NestedEnumArticleStatusFilter<$PrismaModel> | $Enums.ArticleStatus
  }

  export type EnumArticleVisibilityFilter<$PrismaModel = never> = {
    equals?: $Enums.ArticleVisibility | EnumArticleVisibilityFieldRefInput<$PrismaModel>
    in?: $Enums.ArticleVisibility[]
    notIn?: $Enums.ArticleVisibility[]
    not?: NestedEnumArticleVisibilityFilter<$PrismaModel> | $Enums.ArticleVisibility
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type EnumDifficultyLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.DifficultyLevel | EnumDifficultyLevelFieldRefInput<$PrismaModel>
    in?: $Enums.DifficultyLevel[]
    notIn?: $Enums.DifficultyLevel[]
    not?: NestedEnumDifficultyLevelFilter<$PrismaModel> | $Enums.DifficultyLevel
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type KnowledgeCategoryScalarRelationFilter = {
    is?: KnowledgeCategoryWhereInput
    isNot?: KnowledgeCategoryWhereInput
  }

  export type ArticleCommentListRelationFilter = {
    every?: ArticleCommentWhereInput
    some?: ArticleCommentWhereInput
    none?: ArticleCommentWhereInput
  }

  export type ArticleLikeListRelationFilter = {
    every?: ArticleLikeWhereInput
    some?: ArticleLikeWhereInput
    none?: ArticleLikeWhereInput
  }

  export type ArticleViewListRelationFilter = {
    every?: ArticleViewWhereInput
    some?: ArticleViewWhereInput
    none?: ArticleViewWhereInput
  }

  export type ArticleRevisionListRelationFilter = {
    every?: ArticleRevisionWhereInput
    some?: ArticleRevisionWhereInput
    none?: ArticleRevisionWhereInput
  }

  export type ArticleAttachmentListRelationFilter = {
    every?: ArticleAttachmentWhereInput
    some?: ArticleAttachmentWhereInput
    none?: ArticleAttachmentWhereInput
  }

  export type ArticleCommentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ArticleLikeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ArticleViewOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ArticleRevisionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ArticleAttachmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ArticleCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    summary?: SortOrder
    categoryId?: SortOrder
    authorId?: SortOrder
    status?: SortOrder
    visibility?: SortOrder
    tags?: SortOrder
    keywords?: SortOrder
    estimatedReadTime?: SortOrder
    difficulty?: SortOrder
    viewCount?: SortOrder
    likeCount?: SortOrder
    reviewerId?: SortOrder
    reviewedAt?: SortOrder
    publishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ArticleAvgOrderByAggregateInput = {
    estimatedReadTime?: SortOrder
    viewCount?: SortOrder
    likeCount?: SortOrder
  }

  export type ArticleMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    summary?: SortOrder
    categoryId?: SortOrder
    authorId?: SortOrder
    status?: SortOrder
    visibility?: SortOrder
    tags?: SortOrder
    keywords?: SortOrder
    estimatedReadTime?: SortOrder
    difficulty?: SortOrder
    viewCount?: SortOrder
    likeCount?: SortOrder
    reviewerId?: SortOrder
    reviewedAt?: SortOrder
    publishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ArticleMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    summary?: SortOrder
    categoryId?: SortOrder
    authorId?: SortOrder
    status?: SortOrder
    visibility?: SortOrder
    tags?: SortOrder
    keywords?: SortOrder
    estimatedReadTime?: SortOrder
    difficulty?: SortOrder
    viewCount?: SortOrder
    likeCount?: SortOrder
    reviewerId?: SortOrder
    reviewedAt?: SortOrder
    publishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ArticleSumOrderByAggregateInput = {
    estimatedReadTime?: SortOrder
    viewCount?: SortOrder
    likeCount?: SortOrder
  }

  export type EnumArticleStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ArticleStatus | EnumArticleStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ArticleStatus[]
    notIn?: $Enums.ArticleStatus[]
    not?: NestedEnumArticleStatusWithAggregatesFilter<$PrismaModel> | $Enums.ArticleStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumArticleStatusFilter<$PrismaModel>
    _max?: NestedEnumArticleStatusFilter<$PrismaModel>
  }

  export type EnumArticleVisibilityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ArticleVisibility | EnumArticleVisibilityFieldRefInput<$PrismaModel>
    in?: $Enums.ArticleVisibility[]
    notIn?: $Enums.ArticleVisibility[]
    not?: NestedEnumArticleVisibilityWithAggregatesFilter<$PrismaModel> | $Enums.ArticleVisibility
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumArticleVisibilityFilter<$PrismaModel>
    _max?: NestedEnumArticleVisibilityFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumDifficultyLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DifficultyLevel | EnumDifficultyLevelFieldRefInput<$PrismaModel>
    in?: $Enums.DifficultyLevel[]
    notIn?: $Enums.DifficultyLevel[]
    not?: NestedEnumDifficultyLevelWithAggregatesFilter<$PrismaModel> | $Enums.DifficultyLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDifficultyLevelFilter<$PrismaModel>
    _max?: NestedEnumDifficultyLevelFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type ArticleScalarRelationFilter = {
    is?: ArticleWhereInput
    isNot?: ArticleWhereInput
  }

  export type ArticleRevisionArticleIdVersionCompoundUniqueInput = {
    articleId: string
    version: number
  }

  export type ArticleRevisionCountOrderByAggregateInput = {
    id?: SortOrder
    articleId?: SortOrder
    version?: SortOrder
    title?: SortOrder
    content?: SortOrder
    summary?: SortOrder
    changes?: SortOrder
    authorId?: SortOrder
    createdAt?: SortOrder
  }

  export type ArticleRevisionAvgOrderByAggregateInput = {
    version?: SortOrder
  }

  export type ArticleRevisionMaxOrderByAggregateInput = {
    id?: SortOrder
    articleId?: SortOrder
    version?: SortOrder
    title?: SortOrder
    content?: SortOrder
    summary?: SortOrder
    changes?: SortOrder
    authorId?: SortOrder
    createdAt?: SortOrder
  }

  export type ArticleRevisionMinOrderByAggregateInput = {
    id?: SortOrder
    articleId?: SortOrder
    version?: SortOrder
    title?: SortOrder
    content?: SortOrder
    summary?: SortOrder
    changes?: SortOrder
    authorId?: SortOrder
    createdAt?: SortOrder
  }

  export type ArticleRevisionSumOrderByAggregateInput = {
    version?: SortOrder
  }

  export type ArticleCommentNullableScalarRelationFilter = {
    is?: ArticleCommentWhereInput | null
    isNot?: ArticleCommentWhereInput | null
  }

  export type ArticleCommentCountOrderByAggregateInput = {
    id?: SortOrder
    articleId?: SortOrder
    authorId?: SortOrder
    content?: SortOrder
    parentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ArticleCommentMaxOrderByAggregateInput = {
    id?: SortOrder
    articleId?: SortOrder
    authorId?: SortOrder
    content?: SortOrder
    parentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ArticleCommentMinOrderByAggregateInput = {
    id?: SortOrder
    articleId?: SortOrder
    authorId?: SortOrder
    content?: SortOrder
    parentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ArticleLikeArticleIdUserIdCompoundUniqueInput = {
    articleId: string
    userId: string
  }

  export type ArticleLikeCountOrderByAggregateInput = {
    id?: SortOrder
    articleId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type ArticleLikeMaxOrderByAggregateInput = {
    id?: SortOrder
    articleId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type ArticleLikeMinOrderByAggregateInput = {
    id?: SortOrder
    articleId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type ArticleViewArticleIdUserIdCompoundUniqueInput = {
    articleId: string
    userId: string
  }

  export type ArticleViewCountOrderByAggregateInput = {
    id?: SortOrder
    articleId?: SortOrder
    userId?: SortOrder
    duration?: SortOrder
    viewedAt?: SortOrder
  }

  export type ArticleViewAvgOrderByAggregateInput = {
    duration?: SortOrder
  }

  export type ArticleViewMaxOrderByAggregateInput = {
    id?: SortOrder
    articleId?: SortOrder
    userId?: SortOrder
    duration?: SortOrder
    viewedAt?: SortOrder
  }

  export type ArticleViewMinOrderByAggregateInput = {
    id?: SortOrder
    articleId?: SortOrder
    userId?: SortOrder
    duration?: SortOrder
    viewedAt?: SortOrder
  }

  export type ArticleViewSumOrderByAggregateInput = {
    duration?: SortOrder
  }

  export type ArticleAttachmentCountOrderByAggregateInput = {
    id?: SortOrder
    articleId?: SortOrder
    filename?: SortOrder
    originalName?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
  }

  export type ArticleAttachmentAvgOrderByAggregateInput = {
    size?: SortOrder
  }

  export type ArticleAttachmentMaxOrderByAggregateInput = {
    id?: SortOrder
    articleId?: SortOrder
    filename?: SortOrder
    originalName?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
  }

  export type ArticleAttachmentMinOrderByAggregateInput = {
    id?: SortOrder
    articleId?: SortOrder
    filename?: SortOrder
    originalName?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
  }

  export type ArticleAttachmentSumOrderByAggregateInput = {
    size?: SortOrder
  }

  export type EnumTemplateTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TemplateType | EnumTemplateTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TemplateType[]
    notIn?: $Enums.TemplateType[]
    not?: NestedEnumTemplateTypeFilter<$PrismaModel> | $Enums.TemplateType
  }

  export type TemplateCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    content?: SortOrder
    categoryId?: SortOrder
    authorId?: SortOrder
    type?: SortOrder
    tags?: SortOrder
    variables?: SortOrder
    useCount?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TemplateAvgOrderByAggregateInput = {
    useCount?: SortOrder
  }

  export type TemplateMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    content?: SortOrder
    categoryId?: SortOrder
    authorId?: SortOrder
    type?: SortOrder
    tags?: SortOrder
    variables?: SortOrder
    useCount?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TemplateMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    content?: SortOrder
    categoryId?: SortOrder
    authorId?: SortOrder
    type?: SortOrder
    tags?: SortOrder
    variables?: SortOrder
    useCount?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TemplateSumOrderByAggregateInput = {
    useCount?: SortOrder
  }

  export type EnumTemplateTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TemplateType | EnumTemplateTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TemplateType[]
    notIn?: $Enums.TemplateType[]
    not?: NestedEnumTemplateTypeWithAggregatesFilter<$PrismaModel> | $Enums.TemplateType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTemplateTypeFilter<$PrismaModel>
    _max?: NestedEnumTemplateTypeFilter<$PrismaModel>
  }

  export type FAQFeedbackListRelationFilter = {
    every?: FAQFeedbackWhereInput
    some?: FAQFeedbackWhereInput
    none?: FAQFeedbackWhereInput
  }

  export type FAQFeedbackOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FAQCountOrderByAggregateInput = {
    id?: SortOrder
    question?: SortOrder
    answer?: SortOrder
    categoryId?: SortOrder
    authorId?: SortOrder
    viewCount?: SortOrder
    helpfulCount?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FAQAvgOrderByAggregateInput = {
    viewCount?: SortOrder
    helpfulCount?: SortOrder
  }

  export type FAQMaxOrderByAggregateInput = {
    id?: SortOrder
    question?: SortOrder
    answer?: SortOrder
    categoryId?: SortOrder
    authorId?: SortOrder
    viewCount?: SortOrder
    helpfulCount?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FAQMinOrderByAggregateInput = {
    id?: SortOrder
    question?: SortOrder
    answer?: SortOrder
    categoryId?: SortOrder
    authorId?: SortOrder
    viewCount?: SortOrder
    helpfulCount?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FAQSumOrderByAggregateInput = {
    viewCount?: SortOrder
    helpfulCount?: SortOrder
  }

  export type FAQScalarRelationFilter = {
    is?: FAQWhereInput
    isNot?: FAQWhereInput
  }

  export type FAQFeedbackFaqIdUserIdCompoundUniqueInput = {
    faqId: string
    userId: string
  }

  export type FAQFeedbackCountOrderByAggregateInput = {
    id?: SortOrder
    faqId?: SortOrder
    userId?: SortOrder
    isHelpful?: SortOrder
    comment?: SortOrder
    createdAt?: SortOrder
  }

  export type FAQFeedbackMaxOrderByAggregateInput = {
    id?: SortOrder
    faqId?: SortOrder
    userId?: SortOrder
    isHelpful?: SortOrder
    comment?: SortOrder
    createdAt?: SortOrder
  }

  export type FAQFeedbackMinOrderByAggregateInput = {
    id?: SortOrder
    faqId?: SortOrder
    userId?: SortOrder
    isHelpful?: SortOrder
    comment?: SortOrder
    createdAt?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type ExpertReviewListRelationFilter = {
    every?: ExpertReviewWhereInput
    some?: ExpertReviewWhereInput
    none?: ExpertReviewWhereInput
  }

  export type ExpertReviewOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ExpertCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    bio?: SortOrder
    specialties?: SortOrder
    certifications?: SortOrder
    experience?: SortOrder
    contactInfo?: SortOrder
    rating?: SortOrder
    reviewCount?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExpertAvgOrderByAggregateInput = {
    rating?: SortOrder
    reviewCount?: SortOrder
  }

  export type ExpertMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    bio?: SortOrder
    specialties?: SortOrder
    certifications?: SortOrder
    experience?: SortOrder
    contactInfo?: SortOrder
    rating?: SortOrder
    reviewCount?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExpertMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    bio?: SortOrder
    specialties?: SortOrder
    certifications?: SortOrder
    experience?: SortOrder
    contactInfo?: SortOrder
    rating?: SortOrder
    reviewCount?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExpertSumOrderByAggregateInput = {
    rating?: SortOrder
    reviewCount?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type ExpertScalarRelationFilter = {
    is?: ExpertWhereInput
    isNot?: ExpertWhereInput
  }

  export type ExpertReviewExpertIdReviewerIdCompoundUniqueInput = {
    expertId: string
    reviewerId: string
  }

  export type ExpertReviewCountOrderByAggregateInput = {
    id?: SortOrder
    expertId?: SortOrder
    reviewerId?: SortOrder
    rating?: SortOrder
    comment?: SortOrder
    createdAt?: SortOrder
  }

  export type ExpertReviewAvgOrderByAggregateInput = {
    rating?: SortOrder
  }

  export type ExpertReviewMaxOrderByAggregateInput = {
    id?: SortOrder
    expertId?: SortOrder
    reviewerId?: SortOrder
    rating?: SortOrder
    comment?: SortOrder
    createdAt?: SortOrder
  }

  export type ExpertReviewMinOrderByAggregateInput = {
    id?: SortOrder
    expertId?: SortOrder
    reviewerId?: SortOrder
    rating?: SortOrder
    comment?: SortOrder
    createdAt?: SortOrder
  }

  export type ExpertReviewSumOrderByAggregateInput = {
    rating?: SortOrder
  }

  export type SearchLogCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    query?: SortOrder
    results?: SortOrder
    clicked?: SortOrder
    searchedAt?: SortOrder
  }

  export type SearchLogAvgOrderByAggregateInput = {
    results?: SortOrder
  }

  export type SearchLogMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    query?: SortOrder
    results?: SortOrder
    clicked?: SortOrder
    searchedAt?: SortOrder
  }

  export type SearchLogMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    query?: SortOrder
    results?: SortOrder
    clicked?: SortOrder
    searchedAt?: SortOrder
  }

  export type SearchLogSumOrderByAggregateInput = {
    results?: SortOrder
  }

  export type KnowledgeCategoryCreateNestedOneWithoutChildrenInput = {
    create?: XOR<KnowledgeCategoryCreateWithoutChildrenInput, KnowledgeCategoryUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: KnowledgeCategoryCreateOrConnectWithoutChildrenInput
    connect?: KnowledgeCategoryWhereUniqueInput
  }

  export type KnowledgeCategoryCreateNestedManyWithoutParentInput = {
    create?: XOR<KnowledgeCategoryCreateWithoutParentInput, KnowledgeCategoryUncheckedCreateWithoutParentInput> | KnowledgeCategoryCreateWithoutParentInput[] | KnowledgeCategoryUncheckedCreateWithoutParentInput[]
    connectOrCreate?: KnowledgeCategoryCreateOrConnectWithoutParentInput | KnowledgeCategoryCreateOrConnectWithoutParentInput[]
    createMany?: KnowledgeCategoryCreateManyParentInputEnvelope
    connect?: KnowledgeCategoryWhereUniqueInput | KnowledgeCategoryWhereUniqueInput[]
  }

  export type ArticleCreateNestedManyWithoutCategoryInput = {
    create?: XOR<ArticleCreateWithoutCategoryInput, ArticleUncheckedCreateWithoutCategoryInput> | ArticleCreateWithoutCategoryInput[] | ArticleUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ArticleCreateOrConnectWithoutCategoryInput | ArticleCreateOrConnectWithoutCategoryInput[]
    createMany?: ArticleCreateManyCategoryInputEnvelope
    connect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
  }

  export type TemplateCreateNestedManyWithoutCategoryInput = {
    create?: XOR<TemplateCreateWithoutCategoryInput, TemplateUncheckedCreateWithoutCategoryInput> | TemplateCreateWithoutCategoryInput[] | TemplateUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: TemplateCreateOrConnectWithoutCategoryInput | TemplateCreateOrConnectWithoutCategoryInput[]
    createMany?: TemplateCreateManyCategoryInputEnvelope
    connect?: TemplateWhereUniqueInput | TemplateWhereUniqueInput[]
  }

  export type FAQCreateNestedManyWithoutCategoryInput = {
    create?: XOR<FAQCreateWithoutCategoryInput, FAQUncheckedCreateWithoutCategoryInput> | FAQCreateWithoutCategoryInput[] | FAQUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: FAQCreateOrConnectWithoutCategoryInput | FAQCreateOrConnectWithoutCategoryInput[]
    createMany?: FAQCreateManyCategoryInputEnvelope
    connect?: FAQWhereUniqueInput | FAQWhereUniqueInput[]
  }

  export type KnowledgeCategoryUncheckedCreateNestedManyWithoutParentInput = {
    create?: XOR<KnowledgeCategoryCreateWithoutParentInput, KnowledgeCategoryUncheckedCreateWithoutParentInput> | KnowledgeCategoryCreateWithoutParentInput[] | KnowledgeCategoryUncheckedCreateWithoutParentInput[]
    connectOrCreate?: KnowledgeCategoryCreateOrConnectWithoutParentInput | KnowledgeCategoryCreateOrConnectWithoutParentInput[]
    createMany?: KnowledgeCategoryCreateManyParentInputEnvelope
    connect?: KnowledgeCategoryWhereUniqueInput | KnowledgeCategoryWhereUniqueInput[]
  }

  export type ArticleUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: XOR<ArticleCreateWithoutCategoryInput, ArticleUncheckedCreateWithoutCategoryInput> | ArticleCreateWithoutCategoryInput[] | ArticleUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ArticleCreateOrConnectWithoutCategoryInput | ArticleCreateOrConnectWithoutCategoryInput[]
    createMany?: ArticleCreateManyCategoryInputEnvelope
    connect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
  }

  export type TemplateUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: XOR<TemplateCreateWithoutCategoryInput, TemplateUncheckedCreateWithoutCategoryInput> | TemplateCreateWithoutCategoryInput[] | TemplateUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: TemplateCreateOrConnectWithoutCategoryInput | TemplateCreateOrConnectWithoutCategoryInput[]
    createMany?: TemplateCreateManyCategoryInputEnvelope
    connect?: TemplateWhereUniqueInput | TemplateWhereUniqueInput[]
  }

  export type FAQUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: XOR<FAQCreateWithoutCategoryInput, FAQUncheckedCreateWithoutCategoryInput> | FAQCreateWithoutCategoryInput[] | FAQUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: FAQCreateOrConnectWithoutCategoryInput | FAQCreateOrConnectWithoutCategoryInput[]
    createMany?: FAQCreateManyCategoryInputEnvelope
    connect?: FAQWhereUniqueInput | FAQWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type KnowledgeCategoryUpdateOneWithoutChildrenNestedInput = {
    create?: XOR<KnowledgeCategoryCreateWithoutChildrenInput, KnowledgeCategoryUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: KnowledgeCategoryCreateOrConnectWithoutChildrenInput
    upsert?: KnowledgeCategoryUpsertWithoutChildrenInput
    disconnect?: KnowledgeCategoryWhereInput | boolean
    delete?: KnowledgeCategoryWhereInput | boolean
    connect?: KnowledgeCategoryWhereUniqueInput
    update?: XOR<XOR<KnowledgeCategoryUpdateToOneWithWhereWithoutChildrenInput, KnowledgeCategoryUpdateWithoutChildrenInput>, KnowledgeCategoryUncheckedUpdateWithoutChildrenInput>
  }

  export type KnowledgeCategoryUpdateManyWithoutParentNestedInput = {
    create?: XOR<KnowledgeCategoryCreateWithoutParentInput, KnowledgeCategoryUncheckedCreateWithoutParentInput> | KnowledgeCategoryCreateWithoutParentInput[] | KnowledgeCategoryUncheckedCreateWithoutParentInput[]
    connectOrCreate?: KnowledgeCategoryCreateOrConnectWithoutParentInput | KnowledgeCategoryCreateOrConnectWithoutParentInput[]
    upsert?: KnowledgeCategoryUpsertWithWhereUniqueWithoutParentInput | KnowledgeCategoryUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: KnowledgeCategoryCreateManyParentInputEnvelope
    set?: KnowledgeCategoryWhereUniqueInput | KnowledgeCategoryWhereUniqueInput[]
    disconnect?: KnowledgeCategoryWhereUniqueInput | KnowledgeCategoryWhereUniqueInput[]
    delete?: KnowledgeCategoryWhereUniqueInput | KnowledgeCategoryWhereUniqueInput[]
    connect?: KnowledgeCategoryWhereUniqueInput | KnowledgeCategoryWhereUniqueInput[]
    update?: KnowledgeCategoryUpdateWithWhereUniqueWithoutParentInput | KnowledgeCategoryUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: KnowledgeCategoryUpdateManyWithWhereWithoutParentInput | KnowledgeCategoryUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: KnowledgeCategoryScalarWhereInput | KnowledgeCategoryScalarWhereInput[]
  }

  export type ArticleUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<ArticleCreateWithoutCategoryInput, ArticleUncheckedCreateWithoutCategoryInput> | ArticleCreateWithoutCategoryInput[] | ArticleUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ArticleCreateOrConnectWithoutCategoryInput | ArticleCreateOrConnectWithoutCategoryInput[]
    upsert?: ArticleUpsertWithWhereUniqueWithoutCategoryInput | ArticleUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: ArticleCreateManyCategoryInputEnvelope
    set?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    disconnect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    delete?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    connect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    update?: ArticleUpdateWithWhereUniqueWithoutCategoryInput | ArticleUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: ArticleUpdateManyWithWhereWithoutCategoryInput | ArticleUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: ArticleScalarWhereInput | ArticleScalarWhereInput[]
  }

  export type TemplateUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<TemplateCreateWithoutCategoryInput, TemplateUncheckedCreateWithoutCategoryInput> | TemplateCreateWithoutCategoryInput[] | TemplateUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: TemplateCreateOrConnectWithoutCategoryInput | TemplateCreateOrConnectWithoutCategoryInput[]
    upsert?: TemplateUpsertWithWhereUniqueWithoutCategoryInput | TemplateUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: TemplateCreateManyCategoryInputEnvelope
    set?: TemplateWhereUniqueInput | TemplateWhereUniqueInput[]
    disconnect?: TemplateWhereUniqueInput | TemplateWhereUniqueInput[]
    delete?: TemplateWhereUniqueInput | TemplateWhereUniqueInput[]
    connect?: TemplateWhereUniqueInput | TemplateWhereUniqueInput[]
    update?: TemplateUpdateWithWhereUniqueWithoutCategoryInput | TemplateUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: TemplateUpdateManyWithWhereWithoutCategoryInput | TemplateUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: TemplateScalarWhereInput | TemplateScalarWhereInput[]
  }

  export type FAQUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<FAQCreateWithoutCategoryInput, FAQUncheckedCreateWithoutCategoryInput> | FAQCreateWithoutCategoryInput[] | FAQUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: FAQCreateOrConnectWithoutCategoryInput | FAQCreateOrConnectWithoutCategoryInput[]
    upsert?: FAQUpsertWithWhereUniqueWithoutCategoryInput | FAQUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: FAQCreateManyCategoryInputEnvelope
    set?: FAQWhereUniqueInput | FAQWhereUniqueInput[]
    disconnect?: FAQWhereUniqueInput | FAQWhereUniqueInput[]
    delete?: FAQWhereUniqueInput | FAQWhereUniqueInput[]
    connect?: FAQWhereUniqueInput | FAQWhereUniqueInput[]
    update?: FAQUpdateWithWhereUniqueWithoutCategoryInput | FAQUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: FAQUpdateManyWithWhereWithoutCategoryInput | FAQUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: FAQScalarWhereInput | FAQScalarWhereInput[]
  }

  export type KnowledgeCategoryUncheckedUpdateManyWithoutParentNestedInput = {
    create?: XOR<KnowledgeCategoryCreateWithoutParentInput, KnowledgeCategoryUncheckedCreateWithoutParentInput> | KnowledgeCategoryCreateWithoutParentInput[] | KnowledgeCategoryUncheckedCreateWithoutParentInput[]
    connectOrCreate?: KnowledgeCategoryCreateOrConnectWithoutParentInput | KnowledgeCategoryCreateOrConnectWithoutParentInput[]
    upsert?: KnowledgeCategoryUpsertWithWhereUniqueWithoutParentInput | KnowledgeCategoryUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: KnowledgeCategoryCreateManyParentInputEnvelope
    set?: KnowledgeCategoryWhereUniqueInput | KnowledgeCategoryWhereUniqueInput[]
    disconnect?: KnowledgeCategoryWhereUniqueInput | KnowledgeCategoryWhereUniqueInput[]
    delete?: KnowledgeCategoryWhereUniqueInput | KnowledgeCategoryWhereUniqueInput[]
    connect?: KnowledgeCategoryWhereUniqueInput | KnowledgeCategoryWhereUniqueInput[]
    update?: KnowledgeCategoryUpdateWithWhereUniqueWithoutParentInput | KnowledgeCategoryUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: KnowledgeCategoryUpdateManyWithWhereWithoutParentInput | KnowledgeCategoryUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: KnowledgeCategoryScalarWhereInput | KnowledgeCategoryScalarWhereInput[]
  }

  export type ArticleUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<ArticleCreateWithoutCategoryInput, ArticleUncheckedCreateWithoutCategoryInput> | ArticleCreateWithoutCategoryInput[] | ArticleUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ArticleCreateOrConnectWithoutCategoryInput | ArticleCreateOrConnectWithoutCategoryInput[]
    upsert?: ArticleUpsertWithWhereUniqueWithoutCategoryInput | ArticleUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: ArticleCreateManyCategoryInputEnvelope
    set?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    disconnect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    delete?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    connect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    update?: ArticleUpdateWithWhereUniqueWithoutCategoryInput | ArticleUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: ArticleUpdateManyWithWhereWithoutCategoryInput | ArticleUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: ArticleScalarWhereInput | ArticleScalarWhereInput[]
  }

  export type TemplateUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<TemplateCreateWithoutCategoryInput, TemplateUncheckedCreateWithoutCategoryInput> | TemplateCreateWithoutCategoryInput[] | TemplateUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: TemplateCreateOrConnectWithoutCategoryInput | TemplateCreateOrConnectWithoutCategoryInput[]
    upsert?: TemplateUpsertWithWhereUniqueWithoutCategoryInput | TemplateUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: TemplateCreateManyCategoryInputEnvelope
    set?: TemplateWhereUniqueInput | TemplateWhereUniqueInput[]
    disconnect?: TemplateWhereUniqueInput | TemplateWhereUniqueInput[]
    delete?: TemplateWhereUniqueInput | TemplateWhereUniqueInput[]
    connect?: TemplateWhereUniqueInput | TemplateWhereUniqueInput[]
    update?: TemplateUpdateWithWhereUniqueWithoutCategoryInput | TemplateUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: TemplateUpdateManyWithWhereWithoutCategoryInput | TemplateUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: TemplateScalarWhereInput | TemplateScalarWhereInput[]
  }

  export type FAQUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<FAQCreateWithoutCategoryInput, FAQUncheckedCreateWithoutCategoryInput> | FAQCreateWithoutCategoryInput[] | FAQUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: FAQCreateOrConnectWithoutCategoryInput | FAQCreateOrConnectWithoutCategoryInput[]
    upsert?: FAQUpsertWithWhereUniqueWithoutCategoryInput | FAQUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: FAQCreateManyCategoryInputEnvelope
    set?: FAQWhereUniqueInput | FAQWhereUniqueInput[]
    disconnect?: FAQWhereUniqueInput | FAQWhereUniqueInput[]
    delete?: FAQWhereUniqueInput | FAQWhereUniqueInput[]
    connect?: FAQWhereUniqueInput | FAQWhereUniqueInput[]
    update?: FAQUpdateWithWhereUniqueWithoutCategoryInput | FAQUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: FAQUpdateManyWithWhereWithoutCategoryInput | FAQUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: FAQScalarWhereInput | FAQScalarWhereInput[]
  }

  export type KnowledgeCategoryCreateNestedOneWithoutArticlesInput = {
    create?: XOR<KnowledgeCategoryCreateWithoutArticlesInput, KnowledgeCategoryUncheckedCreateWithoutArticlesInput>
    connectOrCreate?: KnowledgeCategoryCreateOrConnectWithoutArticlesInput
    connect?: KnowledgeCategoryWhereUniqueInput
  }

  export type ArticleCommentCreateNestedManyWithoutArticleInput = {
    create?: XOR<ArticleCommentCreateWithoutArticleInput, ArticleCommentUncheckedCreateWithoutArticleInput> | ArticleCommentCreateWithoutArticleInput[] | ArticleCommentUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: ArticleCommentCreateOrConnectWithoutArticleInput | ArticleCommentCreateOrConnectWithoutArticleInput[]
    createMany?: ArticleCommentCreateManyArticleInputEnvelope
    connect?: ArticleCommentWhereUniqueInput | ArticleCommentWhereUniqueInput[]
  }

  export type ArticleLikeCreateNestedManyWithoutArticleInput = {
    create?: XOR<ArticleLikeCreateWithoutArticleInput, ArticleLikeUncheckedCreateWithoutArticleInput> | ArticleLikeCreateWithoutArticleInput[] | ArticleLikeUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: ArticleLikeCreateOrConnectWithoutArticleInput | ArticleLikeCreateOrConnectWithoutArticleInput[]
    createMany?: ArticleLikeCreateManyArticleInputEnvelope
    connect?: ArticleLikeWhereUniqueInput | ArticleLikeWhereUniqueInput[]
  }

  export type ArticleViewCreateNestedManyWithoutArticleInput = {
    create?: XOR<ArticleViewCreateWithoutArticleInput, ArticleViewUncheckedCreateWithoutArticleInput> | ArticleViewCreateWithoutArticleInput[] | ArticleViewUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: ArticleViewCreateOrConnectWithoutArticleInput | ArticleViewCreateOrConnectWithoutArticleInput[]
    createMany?: ArticleViewCreateManyArticleInputEnvelope
    connect?: ArticleViewWhereUniqueInput | ArticleViewWhereUniqueInput[]
  }

  export type ArticleRevisionCreateNestedManyWithoutArticleInput = {
    create?: XOR<ArticleRevisionCreateWithoutArticleInput, ArticleRevisionUncheckedCreateWithoutArticleInput> | ArticleRevisionCreateWithoutArticleInput[] | ArticleRevisionUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: ArticleRevisionCreateOrConnectWithoutArticleInput | ArticleRevisionCreateOrConnectWithoutArticleInput[]
    createMany?: ArticleRevisionCreateManyArticleInputEnvelope
    connect?: ArticleRevisionWhereUniqueInput | ArticleRevisionWhereUniqueInput[]
  }

  export type ArticleAttachmentCreateNestedManyWithoutArticleInput = {
    create?: XOR<ArticleAttachmentCreateWithoutArticleInput, ArticleAttachmentUncheckedCreateWithoutArticleInput> | ArticleAttachmentCreateWithoutArticleInput[] | ArticleAttachmentUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: ArticleAttachmentCreateOrConnectWithoutArticleInput | ArticleAttachmentCreateOrConnectWithoutArticleInput[]
    createMany?: ArticleAttachmentCreateManyArticleInputEnvelope
    connect?: ArticleAttachmentWhereUniqueInput | ArticleAttachmentWhereUniqueInput[]
  }

  export type ArticleCommentUncheckedCreateNestedManyWithoutArticleInput = {
    create?: XOR<ArticleCommentCreateWithoutArticleInput, ArticleCommentUncheckedCreateWithoutArticleInput> | ArticleCommentCreateWithoutArticleInput[] | ArticleCommentUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: ArticleCommentCreateOrConnectWithoutArticleInput | ArticleCommentCreateOrConnectWithoutArticleInput[]
    createMany?: ArticleCommentCreateManyArticleInputEnvelope
    connect?: ArticleCommentWhereUniqueInput | ArticleCommentWhereUniqueInput[]
  }

  export type ArticleLikeUncheckedCreateNestedManyWithoutArticleInput = {
    create?: XOR<ArticleLikeCreateWithoutArticleInput, ArticleLikeUncheckedCreateWithoutArticleInput> | ArticleLikeCreateWithoutArticleInput[] | ArticleLikeUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: ArticleLikeCreateOrConnectWithoutArticleInput | ArticleLikeCreateOrConnectWithoutArticleInput[]
    createMany?: ArticleLikeCreateManyArticleInputEnvelope
    connect?: ArticleLikeWhereUniqueInput | ArticleLikeWhereUniqueInput[]
  }

  export type ArticleViewUncheckedCreateNestedManyWithoutArticleInput = {
    create?: XOR<ArticleViewCreateWithoutArticleInput, ArticleViewUncheckedCreateWithoutArticleInput> | ArticleViewCreateWithoutArticleInput[] | ArticleViewUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: ArticleViewCreateOrConnectWithoutArticleInput | ArticleViewCreateOrConnectWithoutArticleInput[]
    createMany?: ArticleViewCreateManyArticleInputEnvelope
    connect?: ArticleViewWhereUniqueInput | ArticleViewWhereUniqueInput[]
  }

  export type ArticleRevisionUncheckedCreateNestedManyWithoutArticleInput = {
    create?: XOR<ArticleRevisionCreateWithoutArticleInput, ArticleRevisionUncheckedCreateWithoutArticleInput> | ArticleRevisionCreateWithoutArticleInput[] | ArticleRevisionUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: ArticleRevisionCreateOrConnectWithoutArticleInput | ArticleRevisionCreateOrConnectWithoutArticleInput[]
    createMany?: ArticleRevisionCreateManyArticleInputEnvelope
    connect?: ArticleRevisionWhereUniqueInput | ArticleRevisionWhereUniqueInput[]
  }

  export type ArticleAttachmentUncheckedCreateNestedManyWithoutArticleInput = {
    create?: XOR<ArticleAttachmentCreateWithoutArticleInput, ArticleAttachmentUncheckedCreateWithoutArticleInput> | ArticleAttachmentCreateWithoutArticleInput[] | ArticleAttachmentUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: ArticleAttachmentCreateOrConnectWithoutArticleInput | ArticleAttachmentCreateOrConnectWithoutArticleInput[]
    createMany?: ArticleAttachmentCreateManyArticleInputEnvelope
    connect?: ArticleAttachmentWhereUniqueInput | ArticleAttachmentWhereUniqueInput[]
  }

  export type EnumArticleStatusFieldUpdateOperationsInput = {
    set?: $Enums.ArticleStatus
  }

  export type EnumArticleVisibilityFieldUpdateOperationsInput = {
    set?: $Enums.ArticleVisibility
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumDifficultyLevelFieldUpdateOperationsInput = {
    set?: $Enums.DifficultyLevel
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type KnowledgeCategoryUpdateOneRequiredWithoutArticlesNestedInput = {
    create?: XOR<KnowledgeCategoryCreateWithoutArticlesInput, KnowledgeCategoryUncheckedCreateWithoutArticlesInput>
    connectOrCreate?: KnowledgeCategoryCreateOrConnectWithoutArticlesInput
    upsert?: KnowledgeCategoryUpsertWithoutArticlesInput
    connect?: KnowledgeCategoryWhereUniqueInput
    update?: XOR<XOR<KnowledgeCategoryUpdateToOneWithWhereWithoutArticlesInput, KnowledgeCategoryUpdateWithoutArticlesInput>, KnowledgeCategoryUncheckedUpdateWithoutArticlesInput>
  }

  export type ArticleCommentUpdateManyWithoutArticleNestedInput = {
    create?: XOR<ArticleCommentCreateWithoutArticleInput, ArticleCommentUncheckedCreateWithoutArticleInput> | ArticleCommentCreateWithoutArticleInput[] | ArticleCommentUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: ArticleCommentCreateOrConnectWithoutArticleInput | ArticleCommentCreateOrConnectWithoutArticleInput[]
    upsert?: ArticleCommentUpsertWithWhereUniqueWithoutArticleInput | ArticleCommentUpsertWithWhereUniqueWithoutArticleInput[]
    createMany?: ArticleCommentCreateManyArticleInputEnvelope
    set?: ArticleCommentWhereUniqueInput | ArticleCommentWhereUniqueInput[]
    disconnect?: ArticleCommentWhereUniqueInput | ArticleCommentWhereUniqueInput[]
    delete?: ArticleCommentWhereUniqueInput | ArticleCommentWhereUniqueInput[]
    connect?: ArticleCommentWhereUniqueInput | ArticleCommentWhereUniqueInput[]
    update?: ArticleCommentUpdateWithWhereUniqueWithoutArticleInput | ArticleCommentUpdateWithWhereUniqueWithoutArticleInput[]
    updateMany?: ArticleCommentUpdateManyWithWhereWithoutArticleInput | ArticleCommentUpdateManyWithWhereWithoutArticleInput[]
    deleteMany?: ArticleCommentScalarWhereInput | ArticleCommentScalarWhereInput[]
  }

  export type ArticleLikeUpdateManyWithoutArticleNestedInput = {
    create?: XOR<ArticleLikeCreateWithoutArticleInput, ArticleLikeUncheckedCreateWithoutArticleInput> | ArticleLikeCreateWithoutArticleInput[] | ArticleLikeUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: ArticleLikeCreateOrConnectWithoutArticleInput | ArticleLikeCreateOrConnectWithoutArticleInput[]
    upsert?: ArticleLikeUpsertWithWhereUniqueWithoutArticleInput | ArticleLikeUpsertWithWhereUniqueWithoutArticleInput[]
    createMany?: ArticleLikeCreateManyArticleInputEnvelope
    set?: ArticleLikeWhereUniqueInput | ArticleLikeWhereUniqueInput[]
    disconnect?: ArticleLikeWhereUniqueInput | ArticleLikeWhereUniqueInput[]
    delete?: ArticleLikeWhereUniqueInput | ArticleLikeWhereUniqueInput[]
    connect?: ArticleLikeWhereUniqueInput | ArticleLikeWhereUniqueInput[]
    update?: ArticleLikeUpdateWithWhereUniqueWithoutArticleInput | ArticleLikeUpdateWithWhereUniqueWithoutArticleInput[]
    updateMany?: ArticleLikeUpdateManyWithWhereWithoutArticleInput | ArticleLikeUpdateManyWithWhereWithoutArticleInput[]
    deleteMany?: ArticleLikeScalarWhereInput | ArticleLikeScalarWhereInput[]
  }

  export type ArticleViewUpdateManyWithoutArticleNestedInput = {
    create?: XOR<ArticleViewCreateWithoutArticleInput, ArticleViewUncheckedCreateWithoutArticleInput> | ArticleViewCreateWithoutArticleInput[] | ArticleViewUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: ArticleViewCreateOrConnectWithoutArticleInput | ArticleViewCreateOrConnectWithoutArticleInput[]
    upsert?: ArticleViewUpsertWithWhereUniqueWithoutArticleInput | ArticleViewUpsertWithWhereUniqueWithoutArticleInput[]
    createMany?: ArticleViewCreateManyArticleInputEnvelope
    set?: ArticleViewWhereUniqueInput | ArticleViewWhereUniqueInput[]
    disconnect?: ArticleViewWhereUniqueInput | ArticleViewWhereUniqueInput[]
    delete?: ArticleViewWhereUniqueInput | ArticleViewWhereUniqueInput[]
    connect?: ArticleViewWhereUniqueInput | ArticleViewWhereUniqueInput[]
    update?: ArticleViewUpdateWithWhereUniqueWithoutArticleInput | ArticleViewUpdateWithWhereUniqueWithoutArticleInput[]
    updateMany?: ArticleViewUpdateManyWithWhereWithoutArticleInput | ArticleViewUpdateManyWithWhereWithoutArticleInput[]
    deleteMany?: ArticleViewScalarWhereInput | ArticleViewScalarWhereInput[]
  }

  export type ArticleRevisionUpdateManyWithoutArticleNestedInput = {
    create?: XOR<ArticleRevisionCreateWithoutArticleInput, ArticleRevisionUncheckedCreateWithoutArticleInput> | ArticleRevisionCreateWithoutArticleInput[] | ArticleRevisionUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: ArticleRevisionCreateOrConnectWithoutArticleInput | ArticleRevisionCreateOrConnectWithoutArticleInput[]
    upsert?: ArticleRevisionUpsertWithWhereUniqueWithoutArticleInput | ArticleRevisionUpsertWithWhereUniqueWithoutArticleInput[]
    createMany?: ArticleRevisionCreateManyArticleInputEnvelope
    set?: ArticleRevisionWhereUniqueInput | ArticleRevisionWhereUniqueInput[]
    disconnect?: ArticleRevisionWhereUniqueInput | ArticleRevisionWhereUniqueInput[]
    delete?: ArticleRevisionWhereUniqueInput | ArticleRevisionWhereUniqueInput[]
    connect?: ArticleRevisionWhereUniqueInput | ArticleRevisionWhereUniqueInput[]
    update?: ArticleRevisionUpdateWithWhereUniqueWithoutArticleInput | ArticleRevisionUpdateWithWhereUniqueWithoutArticleInput[]
    updateMany?: ArticleRevisionUpdateManyWithWhereWithoutArticleInput | ArticleRevisionUpdateManyWithWhereWithoutArticleInput[]
    deleteMany?: ArticleRevisionScalarWhereInput | ArticleRevisionScalarWhereInput[]
  }

  export type ArticleAttachmentUpdateManyWithoutArticleNestedInput = {
    create?: XOR<ArticleAttachmentCreateWithoutArticleInput, ArticleAttachmentUncheckedCreateWithoutArticleInput> | ArticleAttachmentCreateWithoutArticleInput[] | ArticleAttachmentUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: ArticleAttachmentCreateOrConnectWithoutArticleInput | ArticleAttachmentCreateOrConnectWithoutArticleInput[]
    upsert?: ArticleAttachmentUpsertWithWhereUniqueWithoutArticleInput | ArticleAttachmentUpsertWithWhereUniqueWithoutArticleInput[]
    createMany?: ArticleAttachmentCreateManyArticleInputEnvelope
    set?: ArticleAttachmentWhereUniqueInput | ArticleAttachmentWhereUniqueInput[]
    disconnect?: ArticleAttachmentWhereUniqueInput | ArticleAttachmentWhereUniqueInput[]
    delete?: ArticleAttachmentWhereUniqueInput | ArticleAttachmentWhereUniqueInput[]
    connect?: ArticleAttachmentWhereUniqueInput | ArticleAttachmentWhereUniqueInput[]
    update?: ArticleAttachmentUpdateWithWhereUniqueWithoutArticleInput | ArticleAttachmentUpdateWithWhereUniqueWithoutArticleInput[]
    updateMany?: ArticleAttachmentUpdateManyWithWhereWithoutArticleInput | ArticleAttachmentUpdateManyWithWhereWithoutArticleInput[]
    deleteMany?: ArticleAttachmentScalarWhereInput | ArticleAttachmentScalarWhereInput[]
  }

  export type ArticleCommentUncheckedUpdateManyWithoutArticleNestedInput = {
    create?: XOR<ArticleCommentCreateWithoutArticleInput, ArticleCommentUncheckedCreateWithoutArticleInput> | ArticleCommentCreateWithoutArticleInput[] | ArticleCommentUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: ArticleCommentCreateOrConnectWithoutArticleInput | ArticleCommentCreateOrConnectWithoutArticleInput[]
    upsert?: ArticleCommentUpsertWithWhereUniqueWithoutArticleInput | ArticleCommentUpsertWithWhereUniqueWithoutArticleInput[]
    createMany?: ArticleCommentCreateManyArticleInputEnvelope
    set?: ArticleCommentWhereUniqueInput | ArticleCommentWhereUniqueInput[]
    disconnect?: ArticleCommentWhereUniqueInput | ArticleCommentWhereUniqueInput[]
    delete?: ArticleCommentWhereUniqueInput | ArticleCommentWhereUniqueInput[]
    connect?: ArticleCommentWhereUniqueInput | ArticleCommentWhereUniqueInput[]
    update?: ArticleCommentUpdateWithWhereUniqueWithoutArticleInput | ArticleCommentUpdateWithWhereUniqueWithoutArticleInput[]
    updateMany?: ArticleCommentUpdateManyWithWhereWithoutArticleInput | ArticleCommentUpdateManyWithWhereWithoutArticleInput[]
    deleteMany?: ArticleCommentScalarWhereInput | ArticleCommentScalarWhereInput[]
  }

  export type ArticleLikeUncheckedUpdateManyWithoutArticleNestedInput = {
    create?: XOR<ArticleLikeCreateWithoutArticleInput, ArticleLikeUncheckedCreateWithoutArticleInput> | ArticleLikeCreateWithoutArticleInput[] | ArticleLikeUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: ArticleLikeCreateOrConnectWithoutArticleInput | ArticleLikeCreateOrConnectWithoutArticleInput[]
    upsert?: ArticleLikeUpsertWithWhereUniqueWithoutArticleInput | ArticleLikeUpsertWithWhereUniqueWithoutArticleInput[]
    createMany?: ArticleLikeCreateManyArticleInputEnvelope
    set?: ArticleLikeWhereUniqueInput | ArticleLikeWhereUniqueInput[]
    disconnect?: ArticleLikeWhereUniqueInput | ArticleLikeWhereUniqueInput[]
    delete?: ArticleLikeWhereUniqueInput | ArticleLikeWhereUniqueInput[]
    connect?: ArticleLikeWhereUniqueInput | ArticleLikeWhereUniqueInput[]
    update?: ArticleLikeUpdateWithWhereUniqueWithoutArticleInput | ArticleLikeUpdateWithWhereUniqueWithoutArticleInput[]
    updateMany?: ArticleLikeUpdateManyWithWhereWithoutArticleInput | ArticleLikeUpdateManyWithWhereWithoutArticleInput[]
    deleteMany?: ArticleLikeScalarWhereInput | ArticleLikeScalarWhereInput[]
  }

  export type ArticleViewUncheckedUpdateManyWithoutArticleNestedInput = {
    create?: XOR<ArticleViewCreateWithoutArticleInput, ArticleViewUncheckedCreateWithoutArticleInput> | ArticleViewCreateWithoutArticleInput[] | ArticleViewUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: ArticleViewCreateOrConnectWithoutArticleInput | ArticleViewCreateOrConnectWithoutArticleInput[]
    upsert?: ArticleViewUpsertWithWhereUniqueWithoutArticleInput | ArticleViewUpsertWithWhereUniqueWithoutArticleInput[]
    createMany?: ArticleViewCreateManyArticleInputEnvelope
    set?: ArticleViewWhereUniqueInput | ArticleViewWhereUniqueInput[]
    disconnect?: ArticleViewWhereUniqueInput | ArticleViewWhereUniqueInput[]
    delete?: ArticleViewWhereUniqueInput | ArticleViewWhereUniqueInput[]
    connect?: ArticleViewWhereUniqueInput | ArticleViewWhereUniqueInput[]
    update?: ArticleViewUpdateWithWhereUniqueWithoutArticleInput | ArticleViewUpdateWithWhereUniqueWithoutArticleInput[]
    updateMany?: ArticleViewUpdateManyWithWhereWithoutArticleInput | ArticleViewUpdateManyWithWhereWithoutArticleInput[]
    deleteMany?: ArticleViewScalarWhereInput | ArticleViewScalarWhereInput[]
  }

  export type ArticleRevisionUncheckedUpdateManyWithoutArticleNestedInput = {
    create?: XOR<ArticleRevisionCreateWithoutArticleInput, ArticleRevisionUncheckedCreateWithoutArticleInput> | ArticleRevisionCreateWithoutArticleInput[] | ArticleRevisionUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: ArticleRevisionCreateOrConnectWithoutArticleInput | ArticleRevisionCreateOrConnectWithoutArticleInput[]
    upsert?: ArticleRevisionUpsertWithWhereUniqueWithoutArticleInput | ArticleRevisionUpsertWithWhereUniqueWithoutArticleInput[]
    createMany?: ArticleRevisionCreateManyArticleInputEnvelope
    set?: ArticleRevisionWhereUniqueInput | ArticleRevisionWhereUniqueInput[]
    disconnect?: ArticleRevisionWhereUniqueInput | ArticleRevisionWhereUniqueInput[]
    delete?: ArticleRevisionWhereUniqueInput | ArticleRevisionWhereUniqueInput[]
    connect?: ArticleRevisionWhereUniqueInput | ArticleRevisionWhereUniqueInput[]
    update?: ArticleRevisionUpdateWithWhereUniqueWithoutArticleInput | ArticleRevisionUpdateWithWhereUniqueWithoutArticleInput[]
    updateMany?: ArticleRevisionUpdateManyWithWhereWithoutArticleInput | ArticleRevisionUpdateManyWithWhereWithoutArticleInput[]
    deleteMany?: ArticleRevisionScalarWhereInput | ArticleRevisionScalarWhereInput[]
  }

  export type ArticleAttachmentUncheckedUpdateManyWithoutArticleNestedInput = {
    create?: XOR<ArticleAttachmentCreateWithoutArticleInput, ArticleAttachmentUncheckedCreateWithoutArticleInput> | ArticleAttachmentCreateWithoutArticleInput[] | ArticleAttachmentUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: ArticleAttachmentCreateOrConnectWithoutArticleInput | ArticleAttachmentCreateOrConnectWithoutArticleInput[]
    upsert?: ArticleAttachmentUpsertWithWhereUniqueWithoutArticleInput | ArticleAttachmentUpsertWithWhereUniqueWithoutArticleInput[]
    createMany?: ArticleAttachmentCreateManyArticleInputEnvelope
    set?: ArticleAttachmentWhereUniqueInput | ArticleAttachmentWhereUniqueInput[]
    disconnect?: ArticleAttachmentWhereUniqueInput | ArticleAttachmentWhereUniqueInput[]
    delete?: ArticleAttachmentWhereUniqueInput | ArticleAttachmentWhereUniqueInput[]
    connect?: ArticleAttachmentWhereUniqueInput | ArticleAttachmentWhereUniqueInput[]
    update?: ArticleAttachmentUpdateWithWhereUniqueWithoutArticleInput | ArticleAttachmentUpdateWithWhereUniqueWithoutArticleInput[]
    updateMany?: ArticleAttachmentUpdateManyWithWhereWithoutArticleInput | ArticleAttachmentUpdateManyWithWhereWithoutArticleInput[]
    deleteMany?: ArticleAttachmentScalarWhereInput | ArticleAttachmentScalarWhereInput[]
  }

  export type ArticleCreateNestedOneWithoutRevisionsInput = {
    create?: XOR<ArticleCreateWithoutRevisionsInput, ArticleUncheckedCreateWithoutRevisionsInput>
    connectOrCreate?: ArticleCreateOrConnectWithoutRevisionsInput
    connect?: ArticleWhereUniqueInput
  }

  export type ArticleUpdateOneRequiredWithoutRevisionsNestedInput = {
    create?: XOR<ArticleCreateWithoutRevisionsInput, ArticleUncheckedCreateWithoutRevisionsInput>
    connectOrCreate?: ArticleCreateOrConnectWithoutRevisionsInput
    upsert?: ArticleUpsertWithoutRevisionsInput
    connect?: ArticleWhereUniqueInput
    update?: XOR<XOR<ArticleUpdateToOneWithWhereWithoutRevisionsInput, ArticleUpdateWithoutRevisionsInput>, ArticleUncheckedUpdateWithoutRevisionsInput>
  }

  export type ArticleCreateNestedOneWithoutCommentsInput = {
    create?: XOR<ArticleCreateWithoutCommentsInput, ArticleUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: ArticleCreateOrConnectWithoutCommentsInput
    connect?: ArticleWhereUniqueInput
  }

  export type ArticleCommentCreateNestedOneWithoutRepliesInput = {
    create?: XOR<ArticleCommentCreateWithoutRepliesInput, ArticleCommentUncheckedCreateWithoutRepliesInput>
    connectOrCreate?: ArticleCommentCreateOrConnectWithoutRepliesInput
    connect?: ArticleCommentWhereUniqueInput
  }

  export type ArticleCommentCreateNestedManyWithoutParentInput = {
    create?: XOR<ArticleCommentCreateWithoutParentInput, ArticleCommentUncheckedCreateWithoutParentInput> | ArticleCommentCreateWithoutParentInput[] | ArticleCommentUncheckedCreateWithoutParentInput[]
    connectOrCreate?: ArticleCommentCreateOrConnectWithoutParentInput | ArticleCommentCreateOrConnectWithoutParentInput[]
    createMany?: ArticleCommentCreateManyParentInputEnvelope
    connect?: ArticleCommentWhereUniqueInput | ArticleCommentWhereUniqueInput[]
  }

  export type ArticleCommentUncheckedCreateNestedManyWithoutParentInput = {
    create?: XOR<ArticleCommentCreateWithoutParentInput, ArticleCommentUncheckedCreateWithoutParentInput> | ArticleCommentCreateWithoutParentInput[] | ArticleCommentUncheckedCreateWithoutParentInput[]
    connectOrCreate?: ArticleCommentCreateOrConnectWithoutParentInput | ArticleCommentCreateOrConnectWithoutParentInput[]
    createMany?: ArticleCommentCreateManyParentInputEnvelope
    connect?: ArticleCommentWhereUniqueInput | ArticleCommentWhereUniqueInput[]
  }

  export type ArticleUpdateOneRequiredWithoutCommentsNestedInput = {
    create?: XOR<ArticleCreateWithoutCommentsInput, ArticleUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: ArticleCreateOrConnectWithoutCommentsInput
    upsert?: ArticleUpsertWithoutCommentsInput
    connect?: ArticleWhereUniqueInput
    update?: XOR<XOR<ArticleUpdateToOneWithWhereWithoutCommentsInput, ArticleUpdateWithoutCommentsInput>, ArticleUncheckedUpdateWithoutCommentsInput>
  }

  export type ArticleCommentUpdateOneWithoutRepliesNestedInput = {
    create?: XOR<ArticleCommentCreateWithoutRepliesInput, ArticleCommentUncheckedCreateWithoutRepliesInput>
    connectOrCreate?: ArticleCommentCreateOrConnectWithoutRepliesInput
    upsert?: ArticleCommentUpsertWithoutRepliesInput
    disconnect?: ArticleCommentWhereInput | boolean
    delete?: ArticleCommentWhereInput | boolean
    connect?: ArticleCommentWhereUniqueInput
    update?: XOR<XOR<ArticleCommentUpdateToOneWithWhereWithoutRepliesInput, ArticleCommentUpdateWithoutRepliesInput>, ArticleCommentUncheckedUpdateWithoutRepliesInput>
  }

  export type ArticleCommentUpdateManyWithoutParentNestedInput = {
    create?: XOR<ArticleCommentCreateWithoutParentInput, ArticleCommentUncheckedCreateWithoutParentInput> | ArticleCommentCreateWithoutParentInput[] | ArticleCommentUncheckedCreateWithoutParentInput[]
    connectOrCreate?: ArticleCommentCreateOrConnectWithoutParentInput | ArticleCommentCreateOrConnectWithoutParentInput[]
    upsert?: ArticleCommentUpsertWithWhereUniqueWithoutParentInput | ArticleCommentUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: ArticleCommentCreateManyParentInputEnvelope
    set?: ArticleCommentWhereUniqueInput | ArticleCommentWhereUniqueInput[]
    disconnect?: ArticleCommentWhereUniqueInput | ArticleCommentWhereUniqueInput[]
    delete?: ArticleCommentWhereUniqueInput | ArticleCommentWhereUniqueInput[]
    connect?: ArticleCommentWhereUniqueInput | ArticleCommentWhereUniqueInput[]
    update?: ArticleCommentUpdateWithWhereUniqueWithoutParentInput | ArticleCommentUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: ArticleCommentUpdateManyWithWhereWithoutParentInput | ArticleCommentUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: ArticleCommentScalarWhereInput | ArticleCommentScalarWhereInput[]
  }

  export type ArticleCommentUncheckedUpdateManyWithoutParentNestedInput = {
    create?: XOR<ArticleCommentCreateWithoutParentInput, ArticleCommentUncheckedCreateWithoutParentInput> | ArticleCommentCreateWithoutParentInput[] | ArticleCommentUncheckedCreateWithoutParentInput[]
    connectOrCreate?: ArticleCommentCreateOrConnectWithoutParentInput | ArticleCommentCreateOrConnectWithoutParentInput[]
    upsert?: ArticleCommentUpsertWithWhereUniqueWithoutParentInput | ArticleCommentUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: ArticleCommentCreateManyParentInputEnvelope
    set?: ArticleCommentWhereUniqueInput | ArticleCommentWhereUniqueInput[]
    disconnect?: ArticleCommentWhereUniqueInput | ArticleCommentWhereUniqueInput[]
    delete?: ArticleCommentWhereUniqueInput | ArticleCommentWhereUniqueInput[]
    connect?: ArticleCommentWhereUniqueInput | ArticleCommentWhereUniqueInput[]
    update?: ArticleCommentUpdateWithWhereUniqueWithoutParentInput | ArticleCommentUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: ArticleCommentUpdateManyWithWhereWithoutParentInput | ArticleCommentUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: ArticleCommentScalarWhereInput | ArticleCommentScalarWhereInput[]
  }

  export type ArticleCreateNestedOneWithoutLikesInput = {
    create?: XOR<ArticleCreateWithoutLikesInput, ArticleUncheckedCreateWithoutLikesInput>
    connectOrCreate?: ArticleCreateOrConnectWithoutLikesInput
    connect?: ArticleWhereUniqueInput
  }

  export type ArticleUpdateOneRequiredWithoutLikesNestedInput = {
    create?: XOR<ArticleCreateWithoutLikesInput, ArticleUncheckedCreateWithoutLikesInput>
    connectOrCreate?: ArticleCreateOrConnectWithoutLikesInput
    upsert?: ArticleUpsertWithoutLikesInput
    connect?: ArticleWhereUniqueInput
    update?: XOR<XOR<ArticleUpdateToOneWithWhereWithoutLikesInput, ArticleUpdateWithoutLikesInput>, ArticleUncheckedUpdateWithoutLikesInput>
  }

  export type ArticleCreateNestedOneWithoutViewsInput = {
    create?: XOR<ArticleCreateWithoutViewsInput, ArticleUncheckedCreateWithoutViewsInput>
    connectOrCreate?: ArticleCreateOrConnectWithoutViewsInput
    connect?: ArticleWhereUniqueInput
  }

  export type ArticleUpdateOneRequiredWithoutViewsNestedInput = {
    create?: XOR<ArticleCreateWithoutViewsInput, ArticleUncheckedCreateWithoutViewsInput>
    connectOrCreate?: ArticleCreateOrConnectWithoutViewsInput
    upsert?: ArticleUpsertWithoutViewsInput
    connect?: ArticleWhereUniqueInput
    update?: XOR<XOR<ArticleUpdateToOneWithWhereWithoutViewsInput, ArticleUpdateWithoutViewsInput>, ArticleUncheckedUpdateWithoutViewsInput>
  }

  export type ArticleCreateNestedOneWithoutAttachmentsInput = {
    create?: XOR<ArticleCreateWithoutAttachmentsInput, ArticleUncheckedCreateWithoutAttachmentsInput>
    connectOrCreate?: ArticleCreateOrConnectWithoutAttachmentsInput
    connect?: ArticleWhereUniqueInput
  }

  export type ArticleUpdateOneRequiredWithoutAttachmentsNestedInput = {
    create?: XOR<ArticleCreateWithoutAttachmentsInput, ArticleUncheckedCreateWithoutAttachmentsInput>
    connectOrCreate?: ArticleCreateOrConnectWithoutAttachmentsInput
    upsert?: ArticleUpsertWithoutAttachmentsInput
    connect?: ArticleWhereUniqueInput
    update?: XOR<XOR<ArticleUpdateToOneWithWhereWithoutAttachmentsInput, ArticleUpdateWithoutAttachmentsInput>, ArticleUncheckedUpdateWithoutAttachmentsInput>
  }

  export type KnowledgeCategoryCreateNestedOneWithoutTemplatesInput = {
    create?: XOR<KnowledgeCategoryCreateWithoutTemplatesInput, KnowledgeCategoryUncheckedCreateWithoutTemplatesInput>
    connectOrCreate?: KnowledgeCategoryCreateOrConnectWithoutTemplatesInput
    connect?: KnowledgeCategoryWhereUniqueInput
  }

  export type EnumTemplateTypeFieldUpdateOperationsInput = {
    set?: $Enums.TemplateType
  }

  export type KnowledgeCategoryUpdateOneRequiredWithoutTemplatesNestedInput = {
    create?: XOR<KnowledgeCategoryCreateWithoutTemplatesInput, KnowledgeCategoryUncheckedCreateWithoutTemplatesInput>
    connectOrCreate?: KnowledgeCategoryCreateOrConnectWithoutTemplatesInput
    upsert?: KnowledgeCategoryUpsertWithoutTemplatesInput
    connect?: KnowledgeCategoryWhereUniqueInput
    update?: XOR<XOR<KnowledgeCategoryUpdateToOneWithWhereWithoutTemplatesInput, KnowledgeCategoryUpdateWithoutTemplatesInput>, KnowledgeCategoryUncheckedUpdateWithoutTemplatesInput>
  }

  export type KnowledgeCategoryCreateNestedOneWithoutFaqsInput = {
    create?: XOR<KnowledgeCategoryCreateWithoutFaqsInput, KnowledgeCategoryUncheckedCreateWithoutFaqsInput>
    connectOrCreate?: KnowledgeCategoryCreateOrConnectWithoutFaqsInput
    connect?: KnowledgeCategoryWhereUniqueInput
  }

  export type FAQFeedbackCreateNestedManyWithoutFaqInput = {
    create?: XOR<FAQFeedbackCreateWithoutFaqInput, FAQFeedbackUncheckedCreateWithoutFaqInput> | FAQFeedbackCreateWithoutFaqInput[] | FAQFeedbackUncheckedCreateWithoutFaqInput[]
    connectOrCreate?: FAQFeedbackCreateOrConnectWithoutFaqInput | FAQFeedbackCreateOrConnectWithoutFaqInput[]
    createMany?: FAQFeedbackCreateManyFaqInputEnvelope
    connect?: FAQFeedbackWhereUniqueInput | FAQFeedbackWhereUniqueInput[]
  }

  export type FAQFeedbackUncheckedCreateNestedManyWithoutFaqInput = {
    create?: XOR<FAQFeedbackCreateWithoutFaqInput, FAQFeedbackUncheckedCreateWithoutFaqInput> | FAQFeedbackCreateWithoutFaqInput[] | FAQFeedbackUncheckedCreateWithoutFaqInput[]
    connectOrCreate?: FAQFeedbackCreateOrConnectWithoutFaqInput | FAQFeedbackCreateOrConnectWithoutFaqInput[]
    createMany?: FAQFeedbackCreateManyFaqInputEnvelope
    connect?: FAQFeedbackWhereUniqueInput | FAQFeedbackWhereUniqueInput[]
  }

  export type KnowledgeCategoryUpdateOneRequiredWithoutFaqsNestedInput = {
    create?: XOR<KnowledgeCategoryCreateWithoutFaqsInput, KnowledgeCategoryUncheckedCreateWithoutFaqsInput>
    connectOrCreate?: KnowledgeCategoryCreateOrConnectWithoutFaqsInput
    upsert?: KnowledgeCategoryUpsertWithoutFaqsInput
    connect?: KnowledgeCategoryWhereUniqueInput
    update?: XOR<XOR<KnowledgeCategoryUpdateToOneWithWhereWithoutFaqsInput, KnowledgeCategoryUpdateWithoutFaqsInput>, KnowledgeCategoryUncheckedUpdateWithoutFaqsInput>
  }

  export type FAQFeedbackUpdateManyWithoutFaqNestedInput = {
    create?: XOR<FAQFeedbackCreateWithoutFaqInput, FAQFeedbackUncheckedCreateWithoutFaqInput> | FAQFeedbackCreateWithoutFaqInput[] | FAQFeedbackUncheckedCreateWithoutFaqInput[]
    connectOrCreate?: FAQFeedbackCreateOrConnectWithoutFaqInput | FAQFeedbackCreateOrConnectWithoutFaqInput[]
    upsert?: FAQFeedbackUpsertWithWhereUniqueWithoutFaqInput | FAQFeedbackUpsertWithWhereUniqueWithoutFaqInput[]
    createMany?: FAQFeedbackCreateManyFaqInputEnvelope
    set?: FAQFeedbackWhereUniqueInput | FAQFeedbackWhereUniqueInput[]
    disconnect?: FAQFeedbackWhereUniqueInput | FAQFeedbackWhereUniqueInput[]
    delete?: FAQFeedbackWhereUniqueInput | FAQFeedbackWhereUniqueInput[]
    connect?: FAQFeedbackWhereUniqueInput | FAQFeedbackWhereUniqueInput[]
    update?: FAQFeedbackUpdateWithWhereUniqueWithoutFaqInput | FAQFeedbackUpdateWithWhereUniqueWithoutFaqInput[]
    updateMany?: FAQFeedbackUpdateManyWithWhereWithoutFaqInput | FAQFeedbackUpdateManyWithWhereWithoutFaqInput[]
    deleteMany?: FAQFeedbackScalarWhereInput | FAQFeedbackScalarWhereInput[]
  }

  export type FAQFeedbackUncheckedUpdateManyWithoutFaqNestedInput = {
    create?: XOR<FAQFeedbackCreateWithoutFaqInput, FAQFeedbackUncheckedCreateWithoutFaqInput> | FAQFeedbackCreateWithoutFaqInput[] | FAQFeedbackUncheckedCreateWithoutFaqInput[]
    connectOrCreate?: FAQFeedbackCreateOrConnectWithoutFaqInput | FAQFeedbackCreateOrConnectWithoutFaqInput[]
    upsert?: FAQFeedbackUpsertWithWhereUniqueWithoutFaqInput | FAQFeedbackUpsertWithWhereUniqueWithoutFaqInput[]
    createMany?: FAQFeedbackCreateManyFaqInputEnvelope
    set?: FAQFeedbackWhereUniqueInput | FAQFeedbackWhereUniqueInput[]
    disconnect?: FAQFeedbackWhereUniqueInput | FAQFeedbackWhereUniqueInput[]
    delete?: FAQFeedbackWhereUniqueInput | FAQFeedbackWhereUniqueInput[]
    connect?: FAQFeedbackWhereUniqueInput | FAQFeedbackWhereUniqueInput[]
    update?: FAQFeedbackUpdateWithWhereUniqueWithoutFaqInput | FAQFeedbackUpdateWithWhereUniqueWithoutFaqInput[]
    updateMany?: FAQFeedbackUpdateManyWithWhereWithoutFaqInput | FAQFeedbackUpdateManyWithWhereWithoutFaqInput[]
    deleteMany?: FAQFeedbackScalarWhereInput | FAQFeedbackScalarWhereInput[]
  }

  export type FAQCreateNestedOneWithoutFeedbackInput = {
    create?: XOR<FAQCreateWithoutFeedbackInput, FAQUncheckedCreateWithoutFeedbackInput>
    connectOrCreate?: FAQCreateOrConnectWithoutFeedbackInput
    connect?: FAQWhereUniqueInput
  }

  export type FAQUpdateOneRequiredWithoutFeedbackNestedInput = {
    create?: XOR<FAQCreateWithoutFeedbackInput, FAQUncheckedCreateWithoutFeedbackInput>
    connectOrCreate?: FAQCreateOrConnectWithoutFeedbackInput
    upsert?: FAQUpsertWithoutFeedbackInput
    connect?: FAQWhereUniqueInput
    update?: XOR<XOR<FAQUpdateToOneWithWhereWithoutFeedbackInput, FAQUpdateWithoutFeedbackInput>, FAQUncheckedUpdateWithoutFeedbackInput>
  }

  export type ExpertReviewCreateNestedManyWithoutExpertInput = {
    create?: XOR<ExpertReviewCreateWithoutExpertInput, ExpertReviewUncheckedCreateWithoutExpertInput> | ExpertReviewCreateWithoutExpertInput[] | ExpertReviewUncheckedCreateWithoutExpertInput[]
    connectOrCreate?: ExpertReviewCreateOrConnectWithoutExpertInput | ExpertReviewCreateOrConnectWithoutExpertInput[]
    createMany?: ExpertReviewCreateManyExpertInputEnvelope
    connect?: ExpertReviewWhereUniqueInput | ExpertReviewWhereUniqueInput[]
  }

  export type ExpertReviewUncheckedCreateNestedManyWithoutExpertInput = {
    create?: XOR<ExpertReviewCreateWithoutExpertInput, ExpertReviewUncheckedCreateWithoutExpertInput> | ExpertReviewCreateWithoutExpertInput[] | ExpertReviewUncheckedCreateWithoutExpertInput[]
    connectOrCreate?: ExpertReviewCreateOrConnectWithoutExpertInput | ExpertReviewCreateOrConnectWithoutExpertInput[]
    createMany?: ExpertReviewCreateManyExpertInputEnvelope
    connect?: ExpertReviewWhereUniqueInput | ExpertReviewWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ExpertReviewUpdateManyWithoutExpertNestedInput = {
    create?: XOR<ExpertReviewCreateWithoutExpertInput, ExpertReviewUncheckedCreateWithoutExpertInput> | ExpertReviewCreateWithoutExpertInput[] | ExpertReviewUncheckedCreateWithoutExpertInput[]
    connectOrCreate?: ExpertReviewCreateOrConnectWithoutExpertInput | ExpertReviewCreateOrConnectWithoutExpertInput[]
    upsert?: ExpertReviewUpsertWithWhereUniqueWithoutExpertInput | ExpertReviewUpsertWithWhereUniqueWithoutExpertInput[]
    createMany?: ExpertReviewCreateManyExpertInputEnvelope
    set?: ExpertReviewWhereUniqueInput | ExpertReviewWhereUniqueInput[]
    disconnect?: ExpertReviewWhereUniqueInput | ExpertReviewWhereUniqueInput[]
    delete?: ExpertReviewWhereUniqueInput | ExpertReviewWhereUniqueInput[]
    connect?: ExpertReviewWhereUniqueInput | ExpertReviewWhereUniqueInput[]
    update?: ExpertReviewUpdateWithWhereUniqueWithoutExpertInput | ExpertReviewUpdateWithWhereUniqueWithoutExpertInput[]
    updateMany?: ExpertReviewUpdateManyWithWhereWithoutExpertInput | ExpertReviewUpdateManyWithWhereWithoutExpertInput[]
    deleteMany?: ExpertReviewScalarWhereInput | ExpertReviewScalarWhereInput[]
  }

  export type ExpertReviewUncheckedUpdateManyWithoutExpertNestedInput = {
    create?: XOR<ExpertReviewCreateWithoutExpertInput, ExpertReviewUncheckedCreateWithoutExpertInput> | ExpertReviewCreateWithoutExpertInput[] | ExpertReviewUncheckedCreateWithoutExpertInput[]
    connectOrCreate?: ExpertReviewCreateOrConnectWithoutExpertInput | ExpertReviewCreateOrConnectWithoutExpertInput[]
    upsert?: ExpertReviewUpsertWithWhereUniqueWithoutExpertInput | ExpertReviewUpsertWithWhereUniqueWithoutExpertInput[]
    createMany?: ExpertReviewCreateManyExpertInputEnvelope
    set?: ExpertReviewWhereUniqueInput | ExpertReviewWhereUniqueInput[]
    disconnect?: ExpertReviewWhereUniqueInput | ExpertReviewWhereUniqueInput[]
    delete?: ExpertReviewWhereUniqueInput | ExpertReviewWhereUniqueInput[]
    connect?: ExpertReviewWhereUniqueInput | ExpertReviewWhereUniqueInput[]
    update?: ExpertReviewUpdateWithWhereUniqueWithoutExpertInput | ExpertReviewUpdateWithWhereUniqueWithoutExpertInput[]
    updateMany?: ExpertReviewUpdateManyWithWhereWithoutExpertInput | ExpertReviewUpdateManyWithWhereWithoutExpertInput[]
    deleteMany?: ExpertReviewScalarWhereInput | ExpertReviewScalarWhereInput[]
  }

  export type ExpertCreateNestedOneWithoutReviewsInput = {
    create?: XOR<ExpertCreateWithoutReviewsInput, ExpertUncheckedCreateWithoutReviewsInput>
    connectOrCreate?: ExpertCreateOrConnectWithoutReviewsInput
    connect?: ExpertWhereUniqueInput
  }

  export type ExpertUpdateOneRequiredWithoutReviewsNestedInput = {
    create?: XOR<ExpertCreateWithoutReviewsInput, ExpertUncheckedCreateWithoutReviewsInput>
    connectOrCreate?: ExpertCreateOrConnectWithoutReviewsInput
    upsert?: ExpertUpsertWithoutReviewsInput
    connect?: ExpertWhereUniqueInput
    update?: XOR<XOR<ExpertUpdateToOneWithWhereWithoutReviewsInput, ExpertUpdateWithoutReviewsInput>, ExpertUncheckedUpdateWithoutReviewsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumArticleStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ArticleStatus | EnumArticleStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ArticleStatus[]
    notIn?: $Enums.ArticleStatus[]
    not?: NestedEnumArticleStatusFilter<$PrismaModel> | $Enums.ArticleStatus
  }

  export type NestedEnumArticleVisibilityFilter<$PrismaModel = never> = {
    equals?: $Enums.ArticleVisibility | EnumArticleVisibilityFieldRefInput<$PrismaModel>
    in?: $Enums.ArticleVisibility[]
    notIn?: $Enums.ArticleVisibility[]
    not?: NestedEnumArticleVisibilityFilter<$PrismaModel> | $Enums.ArticleVisibility
  }

  export type NestedEnumDifficultyLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.DifficultyLevel | EnumDifficultyLevelFieldRefInput<$PrismaModel>
    in?: $Enums.DifficultyLevel[]
    notIn?: $Enums.DifficultyLevel[]
    not?: NestedEnumDifficultyLevelFilter<$PrismaModel> | $Enums.DifficultyLevel
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumArticleStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ArticleStatus | EnumArticleStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ArticleStatus[]
    notIn?: $Enums.ArticleStatus[]
    not?: NestedEnumArticleStatusWithAggregatesFilter<$PrismaModel> | $Enums.ArticleStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumArticleStatusFilter<$PrismaModel>
    _max?: NestedEnumArticleStatusFilter<$PrismaModel>
  }

  export type NestedEnumArticleVisibilityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ArticleVisibility | EnumArticleVisibilityFieldRefInput<$PrismaModel>
    in?: $Enums.ArticleVisibility[]
    notIn?: $Enums.ArticleVisibility[]
    not?: NestedEnumArticleVisibilityWithAggregatesFilter<$PrismaModel> | $Enums.ArticleVisibility
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumArticleVisibilityFilter<$PrismaModel>
    _max?: NestedEnumArticleVisibilityFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumDifficultyLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DifficultyLevel | EnumDifficultyLevelFieldRefInput<$PrismaModel>
    in?: $Enums.DifficultyLevel[]
    notIn?: $Enums.DifficultyLevel[]
    not?: NestedEnumDifficultyLevelWithAggregatesFilter<$PrismaModel> | $Enums.DifficultyLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDifficultyLevelFilter<$PrismaModel>
    _max?: NestedEnumDifficultyLevelFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumTemplateTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TemplateType | EnumTemplateTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TemplateType[]
    notIn?: $Enums.TemplateType[]
    not?: NestedEnumTemplateTypeFilter<$PrismaModel> | $Enums.TemplateType
  }

  export type NestedEnumTemplateTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TemplateType | EnumTemplateTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TemplateType[]
    notIn?: $Enums.TemplateType[]
    not?: NestedEnumTemplateTypeWithAggregatesFilter<$PrismaModel> | $Enums.TemplateType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTemplateTypeFilter<$PrismaModel>
    _max?: NestedEnumTemplateTypeFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type KnowledgeCategoryCreateWithoutChildrenInput = {
    id?: string
    name: string
    description?: string | null
    icon?: string | null
    color?: string | null
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    parent?: KnowledgeCategoryCreateNestedOneWithoutChildrenInput
    articles?: ArticleCreateNestedManyWithoutCategoryInput
    templates?: TemplateCreateNestedManyWithoutCategoryInput
    faqs?: FAQCreateNestedManyWithoutCategoryInput
  }

  export type KnowledgeCategoryUncheckedCreateWithoutChildrenInput = {
    id?: string
    name: string
    description?: string | null
    icon?: string | null
    color?: string | null
    order?: number
    parentId?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    articles?: ArticleUncheckedCreateNestedManyWithoutCategoryInput
    templates?: TemplateUncheckedCreateNestedManyWithoutCategoryInput
    faqs?: FAQUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type KnowledgeCategoryCreateOrConnectWithoutChildrenInput = {
    where: KnowledgeCategoryWhereUniqueInput
    create: XOR<KnowledgeCategoryCreateWithoutChildrenInput, KnowledgeCategoryUncheckedCreateWithoutChildrenInput>
  }

  export type KnowledgeCategoryCreateWithoutParentInput = {
    id?: string
    name: string
    description?: string | null
    icon?: string | null
    color?: string | null
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: KnowledgeCategoryCreateNestedManyWithoutParentInput
    articles?: ArticleCreateNestedManyWithoutCategoryInput
    templates?: TemplateCreateNestedManyWithoutCategoryInput
    faqs?: FAQCreateNestedManyWithoutCategoryInput
  }

  export type KnowledgeCategoryUncheckedCreateWithoutParentInput = {
    id?: string
    name: string
    description?: string | null
    icon?: string | null
    color?: string | null
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: KnowledgeCategoryUncheckedCreateNestedManyWithoutParentInput
    articles?: ArticleUncheckedCreateNestedManyWithoutCategoryInput
    templates?: TemplateUncheckedCreateNestedManyWithoutCategoryInput
    faqs?: FAQUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type KnowledgeCategoryCreateOrConnectWithoutParentInput = {
    where: KnowledgeCategoryWhereUniqueInput
    create: XOR<KnowledgeCategoryCreateWithoutParentInput, KnowledgeCategoryUncheckedCreateWithoutParentInput>
  }

  export type KnowledgeCategoryCreateManyParentInputEnvelope = {
    data: KnowledgeCategoryCreateManyParentInput | KnowledgeCategoryCreateManyParentInput[]
  }

  export type ArticleCreateWithoutCategoryInput = {
    id?: string
    title: string
    content: string
    summary?: string | null
    authorId: string
    status?: $Enums.ArticleStatus
    visibility?: $Enums.ArticleVisibility
    tags?: string | null
    keywords?: string | null
    estimatedReadTime?: number | null
    difficulty?: $Enums.DifficultyLevel
    viewCount?: number
    likeCount?: number
    reviewerId?: string | null
    reviewedAt?: Date | string | null
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    comments?: ArticleCommentCreateNestedManyWithoutArticleInput
    likes?: ArticleLikeCreateNestedManyWithoutArticleInput
    views?: ArticleViewCreateNestedManyWithoutArticleInput
    revisions?: ArticleRevisionCreateNestedManyWithoutArticleInput
    attachments?: ArticleAttachmentCreateNestedManyWithoutArticleInput
  }

  export type ArticleUncheckedCreateWithoutCategoryInput = {
    id?: string
    title: string
    content: string
    summary?: string | null
    authorId: string
    status?: $Enums.ArticleStatus
    visibility?: $Enums.ArticleVisibility
    tags?: string | null
    keywords?: string | null
    estimatedReadTime?: number | null
    difficulty?: $Enums.DifficultyLevel
    viewCount?: number
    likeCount?: number
    reviewerId?: string | null
    reviewedAt?: Date | string | null
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    comments?: ArticleCommentUncheckedCreateNestedManyWithoutArticleInput
    likes?: ArticleLikeUncheckedCreateNestedManyWithoutArticleInput
    views?: ArticleViewUncheckedCreateNestedManyWithoutArticleInput
    revisions?: ArticleRevisionUncheckedCreateNestedManyWithoutArticleInput
    attachments?: ArticleAttachmentUncheckedCreateNestedManyWithoutArticleInput
  }

  export type ArticleCreateOrConnectWithoutCategoryInput = {
    where: ArticleWhereUniqueInput
    create: XOR<ArticleCreateWithoutCategoryInput, ArticleUncheckedCreateWithoutCategoryInput>
  }

  export type ArticleCreateManyCategoryInputEnvelope = {
    data: ArticleCreateManyCategoryInput | ArticleCreateManyCategoryInput[]
  }

  export type TemplateCreateWithoutCategoryInput = {
    id?: string
    name: string
    description?: string | null
    content: string
    authorId: string
    type: $Enums.TemplateType
    tags?: string | null
    variables?: string | null
    useCount?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TemplateUncheckedCreateWithoutCategoryInput = {
    id?: string
    name: string
    description?: string | null
    content: string
    authorId: string
    type: $Enums.TemplateType
    tags?: string | null
    variables?: string | null
    useCount?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TemplateCreateOrConnectWithoutCategoryInput = {
    where: TemplateWhereUniqueInput
    create: XOR<TemplateCreateWithoutCategoryInput, TemplateUncheckedCreateWithoutCategoryInput>
  }

  export type TemplateCreateManyCategoryInputEnvelope = {
    data: TemplateCreateManyCategoryInput | TemplateCreateManyCategoryInput[]
  }

  export type FAQCreateWithoutCategoryInput = {
    id?: string
    question: string
    answer: string
    authorId: string
    viewCount?: number
    helpfulCount?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    feedback?: FAQFeedbackCreateNestedManyWithoutFaqInput
  }

  export type FAQUncheckedCreateWithoutCategoryInput = {
    id?: string
    question: string
    answer: string
    authorId: string
    viewCount?: number
    helpfulCount?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    feedback?: FAQFeedbackUncheckedCreateNestedManyWithoutFaqInput
  }

  export type FAQCreateOrConnectWithoutCategoryInput = {
    where: FAQWhereUniqueInput
    create: XOR<FAQCreateWithoutCategoryInput, FAQUncheckedCreateWithoutCategoryInput>
  }

  export type FAQCreateManyCategoryInputEnvelope = {
    data: FAQCreateManyCategoryInput | FAQCreateManyCategoryInput[]
  }

  export type KnowledgeCategoryUpsertWithoutChildrenInput = {
    update: XOR<KnowledgeCategoryUpdateWithoutChildrenInput, KnowledgeCategoryUncheckedUpdateWithoutChildrenInput>
    create: XOR<KnowledgeCategoryCreateWithoutChildrenInput, KnowledgeCategoryUncheckedCreateWithoutChildrenInput>
    where?: KnowledgeCategoryWhereInput
  }

  export type KnowledgeCategoryUpdateToOneWithWhereWithoutChildrenInput = {
    where?: KnowledgeCategoryWhereInput
    data: XOR<KnowledgeCategoryUpdateWithoutChildrenInput, KnowledgeCategoryUncheckedUpdateWithoutChildrenInput>
  }

  export type KnowledgeCategoryUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: KnowledgeCategoryUpdateOneWithoutChildrenNestedInput
    articles?: ArticleUpdateManyWithoutCategoryNestedInput
    templates?: TemplateUpdateManyWithoutCategoryNestedInput
    faqs?: FAQUpdateManyWithoutCategoryNestedInput
  }

  export type KnowledgeCategoryUncheckedUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    articles?: ArticleUncheckedUpdateManyWithoutCategoryNestedInput
    templates?: TemplateUncheckedUpdateManyWithoutCategoryNestedInput
    faqs?: FAQUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type KnowledgeCategoryUpsertWithWhereUniqueWithoutParentInput = {
    where: KnowledgeCategoryWhereUniqueInput
    update: XOR<KnowledgeCategoryUpdateWithoutParentInput, KnowledgeCategoryUncheckedUpdateWithoutParentInput>
    create: XOR<KnowledgeCategoryCreateWithoutParentInput, KnowledgeCategoryUncheckedCreateWithoutParentInput>
  }

  export type KnowledgeCategoryUpdateWithWhereUniqueWithoutParentInput = {
    where: KnowledgeCategoryWhereUniqueInput
    data: XOR<KnowledgeCategoryUpdateWithoutParentInput, KnowledgeCategoryUncheckedUpdateWithoutParentInput>
  }

  export type KnowledgeCategoryUpdateManyWithWhereWithoutParentInput = {
    where: KnowledgeCategoryScalarWhereInput
    data: XOR<KnowledgeCategoryUpdateManyMutationInput, KnowledgeCategoryUncheckedUpdateManyWithoutParentInput>
  }

  export type KnowledgeCategoryScalarWhereInput = {
    AND?: KnowledgeCategoryScalarWhereInput | KnowledgeCategoryScalarWhereInput[]
    OR?: KnowledgeCategoryScalarWhereInput[]
    NOT?: KnowledgeCategoryScalarWhereInput | KnowledgeCategoryScalarWhereInput[]
    id?: StringFilter<"KnowledgeCategory"> | string
    name?: StringFilter<"KnowledgeCategory"> | string
    description?: StringNullableFilter<"KnowledgeCategory"> | string | null
    icon?: StringNullableFilter<"KnowledgeCategory"> | string | null
    color?: StringNullableFilter<"KnowledgeCategory"> | string | null
    order?: IntFilter<"KnowledgeCategory"> | number
    parentId?: StringNullableFilter<"KnowledgeCategory"> | string | null
    isActive?: BoolFilter<"KnowledgeCategory"> | boolean
    createdAt?: DateTimeFilter<"KnowledgeCategory"> | Date | string
    updatedAt?: DateTimeFilter<"KnowledgeCategory"> | Date | string
  }

  export type ArticleUpsertWithWhereUniqueWithoutCategoryInput = {
    where: ArticleWhereUniqueInput
    update: XOR<ArticleUpdateWithoutCategoryInput, ArticleUncheckedUpdateWithoutCategoryInput>
    create: XOR<ArticleCreateWithoutCategoryInput, ArticleUncheckedCreateWithoutCategoryInput>
  }

  export type ArticleUpdateWithWhereUniqueWithoutCategoryInput = {
    where: ArticleWhereUniqueInput
    data: XOR<ArticleUpdateWithoutCategoryInput, ArticleUncheckedUpdateWithoutCategoryInput>
  }

  export type ArticleUpdateManyWithWhereWithoutCategoryInput = {
    where: ArticleScalarWhereInput
    data: XOR<ArticleUpdateManyMutationInput, ArticleUncheckedUpdateManyWithoutCategoryInput>
  }

  export type ArticleScalarWhereInput = {
    AND?: ArticleScalarWhereInput | ArticleScalarWhereInput[]
    OR?: ArticleScalarWhereInput[]
    NOT?: ArticleScalarWhereInput | ArticleScalarWhereInput[]
    id?: StringFilter<"Article"> | string
    title?: StringFilter<"Article"> | string
    content?: StringFilter<"Article"> | string
    summary?: StringNullableFilter<"Article"> | string | null
    categoryId?: StringFilter<"Article"> | string
    authorId?: StringFilter<"Article"> | string
    status?: EnumArticleStatusFilter<"Article"> | $Enums.ArticleStatus
    visibility?: EnumArticleVisibilityFilter<"Article"> | $Enums.ArticleVisibility
    tags?: StringNullableFilter<"Article"> | string | null
    keywords?: StringNullableFilter<"Article"> | string | null
    estimatedReadTime?: IntNullableFilter<"Article"> | number | null
    difficulty?: EnumDifficultyLevelFilter<"Article"> | $Enums.DifficultyLevel
    viewCount?: IntFilter<"Article"> | number
    likeCount?: IntFilter<"Article"> | number
    reviewerId?: StringNullableFilter<"Article"> | string | null
    reviewedAt?: DateTimeNullableFilter<"Article"> | Date | string | null
    publishedAt?: DateTimeNullableFilter<"Article"> | Date | string | null
    createdAt?: DateTimeFilter<"Article"> | Date | string
    updatedAt?: DateTimeFilter<"Article"> | Date | string
  }

  export type TemplateUpsertWithWhereUniqueWithoutCategoryInput = {
    where: TemplateWhereUniqueInput
    update: XOR<TemplateUpdateWithoutCategoryInput, TemplateUncheckedUpdateWithoutCategoryInput>
    create: XOR<TemplateCreateWithoutCategoryInput, TemplateUncheckedCreateWithoutCategoryInput>
  }

  export type TemplateUpdateWithWhereUniqueWithoutCategoryInput = {
    where: TemplateWhereUniqueInput
    data: XOR<TemplateUpdateWithoutCategoryInput, TemplateUncheckedUpdateWithoutCategoryInput>
  }

  export type TemplateUpdateManyWithWhereWithoutCategoryInput = {
    where: TemplateScalarWhereInput
    data: XOR<TemplateUpdateManyMutationInput, TemplateUncheckedUpdateManyWithoutCategoryInput>
  }

  export type TemplateScalarWhereInput = {
    AND?: TemplateScalarWhereInput | TemplateScalarWhereInput[]
    OR?: TemplateScalarWhereInput[]
    NOT?: TemplateScalarWhereInput | TemplateScalarWhereInput[]
    id?: StringFilter<"Template"> | string
    name?: StringFilter<"Template"> | string
    description?: StringNullableFilter<"Template"> | string | null
    content?: StringFilter<"Template"> | string
    categoryId?: StringFilter<"Template"> | string
    authorId?: StringFilter<"Template"> | string
    type?: EnumTemplateTypeFilter<"Template"> | $Enums.TemplateType
    tags?: StringNullableFilter<"Template"> | string | null
    variables?: StringNullableFilter<"Template"> | string | null
    useCount?: IntFilter<"Template"> | number
    isActive?: BoolFilter<"Template"> | boolean
    createdAt?: DateTimeFilter<"Template"> | Date | string
    updatedAt?: DateTimeFilter<"Template"> | Date | string
  }

  export type FAQUpsertWithWhereUniqueWithoutCategoryInput = {
    where: FAQWhereUniqueInput
    update: XOR<FAQUpdateWithoutCategoryInput, FAQUncheckedUpdateWithoutCategoryInput>
    create: XOR<FAQCreateWithoutCategoryInput, FAQUncheckedCreateWithoutCategoryInput>
  }

  export type FAQUpdateWithWhereUniqueWithoutCategoryInput = {
    where: FAQWhereUniqueInput
    data: XOR<FAQUpdateWithoutCategoryInput, FAQUncheckedUpdateWithoutCategoryInput>
  }

  export type FAQUpdateManyWithWhereWithoutCategoryInput = {
    where: FAQScalarWhereInput
    data: XOR<FAQUpdateManyMutationInput, FAQUncheckedUpdateManyWithoutCategoryInput>
  }

  export type FAQScalarWhereInput = {
    AND?: FAQScalarWhereInput | FAQScalarWhereInput[]
    OR?: FAQScalarWhereInput[]
    NOT?: FAQScalarWhereInput | FAQScalarWhereInput[]
    id?: StringFilter<"FAQ"> | string
    question?: StringFilter<"FAQ"> | string
    answer?: StringFilter<"FAQ"> | string
    categoryId?: StringFilter<"FAQ"> | string
    authorId?: StringFilter<"FAQ"> | string
    viewCount?: IntFilter<"FAQ"> | number
    helpfulCount?: IntFilter<"FAQ"> | number
    isActive?: BoolFilter<"FAQ"> | boolean
    createdAt?: DateTimeFilter<"FAQ"> | Date | string
    updatedAt?: DateTimeFilter<"FAQ"> | Date | string
  }

  export type KnowledgeCategoryCreateWithoutArticlesInput = {
    id?: string
    name: string
    description?: string | null
    icon?: string | null
    color?: string | null
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    parent?: KnowledgeCategoryCreateNestedOneWithoutChildrenInput
    children?: KnowledgeCategoryCreateNestedManyWithoutParentInput
    templates?: TemplateCreateNestedManyWithoutCategoryInput
    faqs?: FAQCreateNestedManyWithoutCategoryInput
  }

  export type KnowledgeCategoryUncheckedCreateWithoutArticlesInput = {
    id?: string
    name: string
    description?: string | null
    icon?: string | null
    color?: string | null
    order?: number
    parentId?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: KnowledgeCategoryUncheckedCreateNestedManyWithoutParentInput
    templates?: TemplateUncheckedCreateNestedManyWithoutCategoryInput
    faqs?: FAQUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type KnowledgeCategoryCreateOrConnectWithoutArticlesInput = {
    where: KnowledgeCategoryWhereUniqueInput
    create: XOR<KnowledgeCategoryCreateWithoutArticlesInput, KnowledgeCategoryUncheckedCreateWithoutArticlesInput>
  }

  export type ArticleCommentCreateWithoutArticleInput = {
    id?: string
    authorId: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    parent?: ArticleCommentCreateNestedOneWithoutRepliesInput
    replies?: ArticleCommentCreateNestedManyWithoutParentInput
  }

  export type ArticleCommentUncheckedCreateWithoutArticleInput = {
    id?: string
    authorId: string
    content: string
    parentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    replies?: ArticleCommentUncheckedCreateNestedManyWithoutParentInput
  }

  export type ArticleCommentCreateOrConnectWithoutArticleInput = {
    where: ArticleCommentWhereUniqueInput
    create: XOR<ArticleCommentCreateWithoutArticleInput, ArticleCommentUncheckedCreateWithoutArticleInput>
  }

  export type ArticleCommentCreateManyArticleInputEnvelope = {
    data: ArticleCommentCreateManyArticleInput | ArticleCommentCreateManyArticleInput[]
  }

  export type ArticleLikeCreateWithoutArticleInput = {
    id?: string
    userId: string
    createdAt?: Date | string
  }

  export type ArticleLikeUncheckedCreateWithoutArticleInput = {
    id?: string
    userId: string
    createdAt?: Date | string
  }

  export type ArticleLikeCreateOrConnectWithoutArticleInput = {
    where: ArticleLikeWhereUniqueInput
    create: XOR<ArticleLikeCreateWithoutArticleInput, ArticleLikeUncheckedCreateWithoutArticleInput>
  }

  export type ArticleLikeCreateManyArticleInputEnvelope = {
    data: ArticleLikeCreateManyArticleInput | ArticleLikeCreateManyArticleInput[]
  }

  export type ArticleViewCreateWithoutArticleInput = {
    id?: string
    userId: string
    duration?: number | null
    viewedAt?: Date | string
  }

  export type ArticleViewUncheckedCreateWithoutArticleInput = {
    id?: string
    userId: string
    duration?: number | null
    viewedAt?: Date | string
  }

  export type ArticleViewCreateOrConnectWithoutArticleInput = {
    where: ArticleViewWhereUniqueInput
    create: XOR<ArticleViewCreateWithoutArticleInput, ArticleViewUncheckedCreateWithoutArticleInput>
  }

  export type ArticleViewCreateManyArticleInputEnvelope = {
    data: ArticleViewCreateManyArticleInput | ArticleViewCreateManyArticleInput[]
  }

  export type ArticleRevisionCreateWithoutArticleInput = {
    id?: string
    version: number
    title: string
    content: string
    summary?: string | null
    changes?: string | null
    authorId: string
    createdAt?: Date | string
  }

  export type ArticleRevisionUncheckedCreateWithoutArticleInput = {
    id?: string
    version: number
    title: string
    content: string
    summary?: string | null
    changes?: string | null
    authorId: string
    createdAt?: Date | string
  }

  export type ArticleRevisionCreateOrConnectWithoutArticleInput = {
    where: ArticleRevisionWhereUniqueInput
    create: XOR<ArticleRevisionCreateWithoutArticleInput, ArticleRevisionUncheckedCreateWithoutArticleInput>
  }

  export type ArticleRevisionCreateManyArticleInputEnvelope = {
    data: ArticleRevisionCreateManyArticleInput | ArticleRevisionCreateManyArticleInput[]
  }

  export type ArticleAttachmentCreateWithoutArticleInput = {
    id?: string
    filename: string
    originalName: string
    mimeType: string
    size: number
    url: string
    createdAt?: Date | string
  }

  export type ArticleAttachmentUncheckedCreateWithoutArticleInput = {
    id?: string
    filename: string
    originalName: string
    mimeType: string
    size: number
    url: string
    createdAt?: Date | string
  }

  export type ArticleAttachmentCreateOrConnectWithoutArticleInput = {
    where: ArticleAttachmentWhereUniqueInput
    create: XOR<ArticleAttachmentCreateWithoutArticleInput, ArticleAttachmentUncheckedCreateWithoutArticleInput>
  }

  export type ArticleAttachmentCreateManyArticleInputEnvelope = {
    data: ArticleAttachmentCreateManyArticleInput | ArticleAttachmentCreateManyArticleInput[]
  }

  export type KnowledgeCategoryUpsertWithoutArticlesInput = {
    update: XOR<KnowledgeCategoryUpdateWithoutArticlesInput, KnowledgeCategoryUncheckedUpdateWithoutArticlesInput>
    create: XOR<KnowledgeCategoryCreateWithoutArticlesInput, KnowledgeCategoryUncheckedCreateWithoutArticlesInput>
    where?: KnowledgeCategoryWhereInput
  }

  export type KnowledgeCategoryUpdateToOneWithWhereWithoutArticlesInput = {
    where?: KnowledgeCategoryWhereInput
    data: XOR<KnowledgeCategoryUpdateWithoutArticlesInput, KnowledgeCategoryUncheckedUpdateWithoutArticlesInput>
  }

  export type KnowledgeCategoryUpdateWithoutArticlesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: KnowledgeCategoryUpdateOneWithoutChildrenNestedInput
    children?: KnowledgeCategoryUpdateManyWithoutParentNestedInput
    templates?: TemplateUpdateManyWithoutCategoryNestedInput
    faqs?: FAQUpdateManyWithoutCategoryNestedInput
  }

  export type KnowledgeCategoryUncheckedUpdateWithoutArticlesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: KnowledgeCategoryUncheckedUpdateManyWithoutParentNestedInput
    templates?: TemplateUncheckedUpdateManyWithoutCategoryNestedInput
    faqs?: FAQUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type ArticleCommentUpsertWithWhereUniqueWithoutArticleInput = {
    where: ArticleCommentWhereUniqueInput
    update: XOR<ArticleCommentUpdateWithoutArticleInput, ArticleCommentUncheckedUpdateWithoutArticleInput>
    create: XOR<ArticleCommentCreateWithoutArticleInput, ArticleCommentUncheckedCreateWithoutArticleInput>
  }

  export type ArticleCommentUpdateWithWhereUniqueWithoutArticleInput = {
    where: ArticleCommentWhereUniqueInput
    data: XOR<ArticleCommentUpdateWithoutArticleInput, ArticleCommentUncheckedUpdateWithoutArticleInput>
  }

  export type ArticleCommentUpdateManyWithWhereWithoutArticleInput = {
    where: ArticleCommentScalarWhereInput
    data: XOR<ArticleCommentUpdateManyMutationInput, ArticleCommentUncheckedUpdateManyWithoutArticleInput>
  }

  export type ArticleCommentScalarWhereInput = {
    AND?: ArticleCommentScalarWhereInput | ArticleCommentScalarWhereInput[]
    OR?: ArticleCommentScalarWhereInput[]
    NOT?: ArticleCommentScalarWhereInput | ArticleCommentScalarWhereInput[]
    id?: StringFilter<"ArticleComment"> | string
    articleId?: StringFilter<"ArticleComment"> | string
    authorId?: StringFilter<"ArticleComment"> | string
    content?: StringFilter<"ArticleComment"> | string
    parentId?: StringNullableFilter<"ArticleComment"> | string | null
    createdAt?: DateTimeFilter<"ArticleComment"> | Date | string
    updatedAt?: DateTimeFilter<"ArticleComment"> | Date | string
  }

  export type ArticleLikeUpsertWithWhereUniqueWithoutArticleInput = {
    where: ArticleLikeWhereUniqueInput
    update: XOR<ArticleLikeUpdateWithoutArticleInput, ArticleLikeUncheckedUpdateWithoutArticleInput>
    create: XOR<ArticleLikeCreateWithoutArticleInput, ArticleLikeUncheckedCreateWithoutArticleInput>
  }

  export type ArticleLikeUpdateWithWhereUniqueWithoutArticleInput = {
    where: ArticleLikeWhereUniqueInput
    data: XOR<ArticleLikeUpdateWithoutArticleInput, ArticleLikeUncheckedUpdateWithoutArticleInput>
  }

  export type ArticleLikeUpdateManyWithWhereWithoutArticleInput = {
    where: ArticleLikeScalarWhereInput
    data: XOR<ArticleLikeUpdateManyMutationInput, ArticleLikeUncheckedUpdateManyWithoutArticleInput>
  }

  export type ArticleLikeScalarWhereInput = {
    AND?: ArticleLikeScalarWhereInput | ArticleLikeScalarWhereInput[]
    OR?: ArticleLikeScalarWhereInput[]
    NOT?: ArticleLikeScalarWhereInput | ArticleLikeScalarWhereInput[]
    id?: StringFilter<"ArticleLike"> | string
    articleId?: StringFilter<"ArticleLike"> | string
    userId?: StringFilter<"ArticleLike"> | string
    createdAt?: DateTimeFilter<"ArticleLike"> | Date | string
  }

  export type ArticleViewUpsertWithWhereUniqueWithoutArticleInput = {
    where: ArticleViewWhereUniqueInput
    update: XOR<ArticleViewUpdateWithoutArticleInput, ArticleViewUncheckedUpdateWithoutArticleInput>
    create: XOR<ArticleViewCreateWithoutArticleInput, ArticleViewUncheckedCreateWithoutArticleInput>
  }

  export type ArticleViewUpdateWithWhereUniqueWithoutArticleInput = {
    where: ArticleViewWhereUniqueInput
    data: XOR<ArticleViewUpdateWithoutArticleInput, ArticleViewUncheckedUpdateWithoutArticleInput>
  }

  export type ArticleViewUpdateManyWithWhereWithoutArticleInput = {
    where: ArticleViewScalarWhereInput
    data: XOR<ArticleViewUpdateManyMutationInput, ArticleViewUncheckedUpdateManyWithoutArticleInput>
  }

  export type ArticleViewScalarWhereInput = {
    AND?: ArticleViewScalarWhereInput | ArticleViewScalarWhereInput[]
    OR?: ArticleViewScalarWhereInput[]
    NOT?: ArticleViewScalarWhereInput | ArticleViewScalarWhereInput[]
    id?: StringFilter<"ArticleView"> | string
    articleId?: StringFilter<"ArticleView"> | string
    userId?: StringFilter<"ArticleView"> | string
    duration?: IntNullableFilter<"ArticleView"> | number | null
    viewedAt?: DateTimeFilter<"ArticleView"> | Date | string
  }

  export type ArticleRevisionUpsertWithWhereUniqueWithoutArticleInput = {
    where: ArticleRevisionWhereUniqueInput
    update: XOR<ArticleRevisionUpdateWithoutArticleInput, ArticleRevisionUncheckedUpdateWithoutArticleInput>
    create: XOR<ArticleRevisionCreateWithoutArticleInput, ArticleRevisionUncheckedCreateWithoutArticleInput>
  }

  export type ArticleRevisionUpdateWithWhereUniqueWithoutArticleInput = {
    where: ArticleRevisionWhereUniqueInput
    data: XOR<ArticleRevisionUpdateWithoutArticleInput, ArticleRevisionUncheckedUpdateWithoutArticleInput>
  }

  export type ArticleRevisionUpdateManyWithWhereWithoutArticleInput = {
    where: ArticleRevisionScalarWhereInput
    data: XOR<ArticleRevisionUpdateManyMutationInput, ArticleRevisionUncheckedUpdateManyWithoutArticleInput>
  }

  export type ArticleRevisionScalarWhereInput = {
    AND?: ArticleRevisionScalarWhereInput | ArticleRevisionScalarWhereInput[]
    OR?: ArticleRevisionScalarWhereInput[]
    NOT?: ArticleRevisionScalarWhereInput | ArticleRevisionScalarWhereInput[]
    id?: StringFilter<"ArticleRevision"> | string
    articleId?: StringFilter<"ArticleRevision"> | string
    version?: IntFilter<"ArticleRevision"> | number
    title?: StringFilter<"ArticleRevision"> | string
    content?: StringFilter<"ArticleRevision"> | string
    summary?: StringNullableFilter<"ArticleRevision"> | string | null
    changes?: StringNullableFilter<"ArticleRevision"> | string | null
    authorId?: StringFilter<"ArticleRevision"> | string
    createdAt?: DateTimeFilter<"ArticleRevision"> | Date | string
  }

  export type ArticleAttachmentUpsertWithWhereUniqueWithoutArticleInput = {
    where: ArticleAttachmentWhereUniqueInput
    update: XOR<ArticleAttachmentUpdateWithoutArticleInput, ArticleAttachmentUncheckedUpdateWithoutArticleInput>
    create: XOR<ArticleAttachmentCreateWithoutArticleInput, ArticleAttachmentUncheckedCreateWithoutArticleInput>
  }

  export type ArticleAttachmentUpdateWithWhereUniqueWithoutArticleInput = {
    where: ArticleAttachmentWhereUniqueInput
    data: XOR<ArticleAttachmentUpdateWithoutArticleInput, ArticleAttachmentUncheckedUpdateWithoutArticleInput>
  }

  export type ArticleAttachmentUpdateManyWithWhereWithoutArticleInput = {
    where: ArticleAttachmentScalarWhereInput
    data: XOR<ArticleAttachmentUpdateManyMutationInput, ArticleAttachmentUncheckedUpdateManyWithoutArticleInput>
  }

  export type ArticleAttachmentScalarWhereInput = {
    AND?: ArticleAttachmentScalarWhereInput | ArticleAttachmentScalarWhereInput[]
    OR?: ArticleAttachmentScalarWhereInput[]
    NOT?: ArticleAttachmentScalarWhereInput | ArticleAttachmentScalarWhereInput[]
    id?: StringFilter<"ArticleAttachment"> | string
    articleId?: StringFilter<"ArticleAttachment"> | string
    filename?: StringFilter<"ArticleAttachment"> | string
    originalName?: StringFilter<"ArticleAttachment"> | string
    mimeType?: StringFilter<"ArticleAttachment"> | string
    size?: IntFilter<"ArticleAttachment"> | number
    url?: StringFilter<"ArticleAttachment"> | string
    createdAt?: DateTimeFilter<"ArticleAttachment"> | Date | string
  }

  export type ArticleCreateWithoutRevisionsInput = {
    id?: string
    title: string
    content: string
    summary?: string | null
    authorId: string
    status?: $Enums.ArticleStatus
    visibility?: $Enums.ArticleVisibility
    tags?: string | null
    keywords?: string | null
    estimatedReadTime?: number | null
    difficulty?: $Enums.DifficultyLevel
    viewCount?: number
    likeCount?: number
    reviewerId?: string | null
    reviewedAt?: Date | string | null
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    category: KnowledgeCategoryCreateNestedOneWithoutArticlesInput
    comments?: ArticleCommentCreateNestedManyWithoutArticleInput
    likes?: ArticleLikeCreateNestedManyWithoutArticleInput
    views?: ArticleViewCreateNestedManyWithoutArticleInput
    attachments?: ArticleAttachmentCreateNestedManyWithoutArticleInput
  }

  export type ArticleUncheckedCreateWithoutRevisionsInput = {
    id?: string
    title: string
    content: string
    summary?: string | null
    categoryId: string
    authorId: string
    status?: $Enums.ArticleStatus
    visibility?: $Enums.ArticleVisibility
    tags?: string | null
    keywords?: string | null
    estimatedReadTime?: number | null
    difficulty?: $Enums.DifficultyLevel
    viewCount?: number
    likeCount?: number
    reviewerId?: string | null
    reviewedAt?: Date | string | null
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    comments?: ArticleCommentUncheckedCreateNestedManyWithoutArticleInput
    likes?: ArticleLikeUncheckedCreateNestedManyWithoutArticleInput
    views?: ArticleViewUncheckedCreateNestedManyWithoutArticleInput
    attachments?: ArticleAttachmentUncheckedCreateNestedManyWithoutArticleInput
  }

  export type ArticleCreateOrConnectWithoutRevisionsInput = {
    where: ArticleWhereUniqueInput
    create: XOR<ArticleCreateWithoutRevisionsInput, ArticleUncheckedCreateWithoutRevisionsInput>
  }

  export type ArticleUpsertWithoutRevisionsInput = {
    update: XOR<ArticleUpdateWithoutRevisionsInput, ArticleUncheckedUpdateWithoutRevisionsInput>
    create: XOR<ArticleCreateWithoutRevisionsInput, ArticleUncheckedCreateWithoutRevisionsInput>
    where?: ArticleWhereInput
  }

  export type ArticleUpdateToOneWithWhereWithoutRevisionsInput = {
    where?: ArticleWhereInput
    data: XOR<ArticleUpdateWithoutRevisionsInput, ArticleUncheckedUpdateWithoutRevisionsInput>
  }

  export type ArticleUpdateWithoutRevisionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    authorId?: StringFieldUpdateOperationsInput | string
    status?: EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus
    visibility?: EnumArticleVisibilityFieldUpdateOperationsInput | $Enums.ArticleVisibility
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedReadTime?: NullableIntFieldUpdateOperationsInput | number | null
    difficulty?: EnumDifficultyLevelFieldUpdateOperationsInput | $Enums.DifficultyLevel
    viewCount?: IntFieldUpdateOperationsInput | number
    likeCount?: IntFieldUpdateOperationsInput | number
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: KnowledgeCategoryUpdateOneRequiredWithoutArticlesNestedInput
    comments?: ArticleCommentUpdateManyWithoutArticleNestedInput
    likes?: ArticleLikeUpdateManyWithoutArticleNestedInput
    views?: ArticleViewUpdateManyWithoutArticleNestedInput
    attachments?: ArticleAttachmentUpdateManyWithoutArticleNestedInput
  }

  export type ArticleUncheckedUpdateWithoutRevisionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    categoryId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    status?: EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus
    visibility?: EnumArticleVisibilityFieldUpdateOperationsInput | $Enums.ArticleVisibility
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedReadTime?: NullableIntFieldUpdateOperationsInput | number | null
    difficulty?: EnumDifficultyLevelFieldUpdateOperationsInput | $Enums.DifficultyLevel
    viewCount?: IntFieldUpdateOperationsInput | number
    likeCount?: IntFieldUpdateOperationsInput | number
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: ArticleCommentUncheckedUpdateManyWithoutArticleNestedInput
    likes?: ArticleLikeUncheckedUpdateManyWithoutArticleNestedInput
    views?: ArticleViewUncheckedUpdateManyWithoutArticleNestedInput
    attachments?: ArticleAttachmentUncheckedUpdateManyWithoutArticleNestedInput
  }

  export type ArticleCreateWithoutCommentsInput = {
    id?: string
    title: string
    content: string
    summary?: string | null
    authorId: string
    status?: $Enums.ArticleStatus
    visibility?: $Enums.ArticleVisibility
    tags?: string | null
    keywords?: string | null
    estimatedReadTime?: number | null
    difficulty?: $Enums.DifficultyLevel
    viewCount?: number
    likeCount?: number
    reviewerId?: string | null
    reviewedAt?: Date | string | null
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    category: KnowledgeCategoryCreateNestedOneWithoutArticlesInput
    likes?: ArticleLikeCreateNestedManyWithoutArticleInput
    views?: ArticleViewCreateNestedManyWithoutArticleInput
    revisions?: ArticleRevisionCreateNestedManyWithoutArticleInput
    attachments?: ArticleAttachmentCreateNestedManyWithoutArticleInput
  }

  export type ArticleUncheckedCreateWithoutCommentsInput = {
    id?: string
    title: string
    content: string
    summary?: string | null
    categoryId: string
    authorId: string
    status?: $Enums.ArticleStatus
    visibility?: $Enums.ArticleVisibility
    tags?: string | null
    keywords?: string | null
    estimatedReadTime?: number | null
    difficulty?: $Enums.DifficultyLevel
    viewCount?: number
    likeCount?: number
    reviewerId?: string | null
    reviewedAt?: Date | string | null
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    likes?: ArticleLikeUncheckedCreateNestedManyWithoutArticleInput
    views?: ArticleViewUncheckedCreateNestedManyWithoutArticleInput
    revisions?: ArticleRevisionUncheckedCreateNestedManyWithoutArticleInput
    attachments?: ArticleAttachmentUncheckedCreateNestedManyWithoutArticleInput
  }

  export type ArticleCreateOrConnectWithoutCommentsInput = {
    where: ArticleWhereUniqueInput
    create: XOR<ArticleCreateWithoutCommentsInput, ArticleUncheckedCreateWithoutCommentsInput>
  }

  export type ArticleCommentCreateWithoutRepliesInput = {
    id?: string
    authorId: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    article: ArticleCreateNestedOneWithoutCommentsInput
    parent?: ArticleCommentCreateNestedOneWithoutRepliesInput
  }

  export type ArticleCommentUncheckedCreateWithoutRepliesInput = {
    id?: string
    articleId: string
    authorId: string
    content: string
    parentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ArticleCommentCreateOrConnectWithoutRepliesInput = {
    where: ArticleCommentWhereUniqueInput
    create: XOR<ArticleCommentCreateWithoutRepliesInput, ArticleCommentUncheckedCreateWithoutRepliesInput>
  }

  export type ArticleCommentCreateWithoutParentInput = {
    id?: string
    authorId: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    article: ArticleCreateNestedOneWithoutCommentsInput
    replies?: ArticleCommentCreateNestedManyWithoutParentInput
  }

  export type ArticleCommentUncheckedCreateWithoutParentInput = {
    id?: string
    articleId: string
    authorId: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    replies?: ArticleCommentUncheckedCreateNestedManyWithoutParentInput
  }

  export type ArticleCommentCreateOrConnectWithoutParentInput = {
    where: ArticleCommentWhereUniqueInput
    create: XOR<ArticleCommentCreateWithoutParentInput, ArticleCommentUncheckedCreateWithoutParentInput>
  }

  export type ArticleCommentCreateManyParentInputEnvelope = {
    data: ArticleCommentCreateManyParentInput | ArticleCommentCreateManyParentInput[]
  }

  export type ArticleUpsertWithoutCommentsInput = {
    update: XOR<ArticleUpdateWithoutCommentsInput, ArticleUncheckedUpdateWithoutCommentsInput>
    create: XOR<ArticleCreateWithoutCommentsInput, ArticleUncheckedCreateWithoutCommentsInput>
    where?: ArticleWhereInput
  }

  export type ArticleUpdateToOneWithWhereWithoutCommentsInput = {
    where?: ArticleWhereInput
    data: XOR<ArticleUpdateWithoutCommentsInput, ArticleUncheckedUpdateWithoutCommentsInput>
  }

  export type ArticleUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    authorId?: StringFieldUpdateOperationsInput | string
    status?: EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus
    visibility?: EnumArticleVisibilityFieldUpdateOperationsInput | $Enums.ArticleVisibility
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedReadTime?: NullableIntFieldUpdateOperationsInput | number | null
    difficulty?: EnumDifficultyLevelFieldUpdateOperationsInput | $Enums.DifficultyLevel
    viewCount?: IntFieldUpdateOperationsInput | number
    likeCount?: IntFieldUpdateOperationsInput | number
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: KnowledgeCategoryUpdateOneRequiredWithoutArticlesNestedInput
    likes?: ArticleLikeUpdateManyWithoutArticleNestedInput
    views?: ArticleViewUpdateManyWithoutArticleNestedInput
    revisions?: ArticleRevisionUpdateManyWithoutArticleNestedInput
    attachments?: ArticleAttachmentUpdateManyWithoutArticleNestedInput
  }

  export type ArticleUncheckedUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    categoryId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    status?: EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus
    visibility?: EnumArticleVisibilityFieldUpdateOperationsInput | $Enums.ArticleVisibility
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedReadTime?: NullableIntFieldUpdateOperationsInput | number | null
    difficulty?: EnumDifficultyLevelFieldUpdateOperationsInput | $Enums.DifficultyLevel
    viewCount?: IntFieldUpdateOperationsInput | number
    likeCount?: IntFieldUpdateOperationsInput | number
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: ArticleLikeUncheckedUpdateManyWithoutArticleNestedInput
    views?: ArticleViewUncheckedUpdateManyWithoutArticleNestedInput
    revisions?: ArticleRevisionUncheckedUpdateManyWithoutArticleNestedInput
    attachments?: ArticleAttachmentUncheckedUpdateManyWithoutArticleNestedInput
  }

  export type ArticleCommentUpsertWithoutRepliesInput = {
    update: XOR<ArticleCommentUpdateWithoutRepliesInput, ArticleCommentUncheckedUpdateWithoutRepliesInput>
    create: XOR<ArticleCommentCreateWithoutRepliesInput, ArticleCommentUncheckedCreateWithoutRepliesInput>
    where?: ArticleCommentWhereInput
  }

  export type ArticleCommentUpdateToOneWithWhereWithoutRepliesInput = {
    where?: ArticleCommentWhereInput
    data: XOR<ArticleCommentUpdateWithoutRepliesInput, ArticleCommentUncheckedUpdateWithoutRepliesInput>
  }

  export type ArticleCommentUpdateWithoutRepliesInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    article?: ArticleUpdateOneRequiredWithoutCommentsNestedInput
    parent?: ArticleCommentUpdateOneWithoutRepliesNestedInput
  }

  export type ArticleCommentUncheckedUpdateWithoutRepliesInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleCommentUpsertWithWhereUniqueWithoutParentInput = {
    where: ArticleCommentWhereUniqueInput
    update: XOR<ArticleCommentUpdateWithoutParentInput, ArticleCommentUncheckedUpdateWithoutParentInput>
    create: XOR<ArticleCommentCreateWithoutParentInput, ArticleCommentUncheckedCreateWithoutParentInput>
  }

  export type ArticleCommentUpdateWithWhereUniqueWithoutParentInput = {
    where: ArticleCommentWhereUniqueInput
    data: XOR<ArticleCommentUpdateWithoutParentInput, ArticleCommentUncheckedUpdateWithoutParentInput>
  }

  export type ArticleCommentUpdateManyWithWhereWithoutParentInput = {
    where: ArticleCommentScalarWhereInput
    data: XOR<ArticleCommentUpdateManyMutationInput, ArticleCommentUncheckedUpdateManyWithoutParentInput>
  }

  export type ArticleCreateWithoutLikesInput = {
    id?: string
    title: string
    content: string
    summary?: string | null
    authorId: string
    status?: $Enums.ArticleStatus
    visibility?: $Enums.ArticleVisibility
    tags?: string | null
    keywords?: string | null
    estimatedReadTime?: number | null
    difficulty?: $Enums.DifficultyLevel
    viewCount?: number
    likeCount?: number
    reviewerId?: string | null
    reviewedAt?: Date | string | null
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    category: KnowledgeCategoryCreateNestedOneWithoutArticlesInput
    comments?: ArticleCommentCreateNestedManyWithoutArticleInput
    views?: ArticleViewCreateNestedManyWithoutArticleInput
    revisions?: ArticleRevisionCreateNestedManyWithoutArticleInput
    attachments?: ArticleAttachmentCreateNestedManyWithoutArticleInput
  }

  export type ArticleUncheckedCreateWithoutLikesInput = {
    id?: string
    title: string
    content: string
    summary?: string | null
    categoryId: string
    authorId: string
    status?: $Enums.ArticleStatus
    visibility?: $Enums.ArticleVisibility
    tags?: string | null
    keywords?: string | null
    estimatedReadTime?: number | null
    difficulty?: $Enums.DifficultyLevel
    viewCount?: number
    likeCount?: number
    reviewerId?: string | null
    reviewedAt?: Date | string | null
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    comments?: ArticleCommentUncheckedCreateNestedManyWithoutArticleInput
    views?: ArticleViewUncheckedCreateNestedManyWithoutArticleInput
    revisions?: ArticleRevisionUncheckedCreateNestedManyWithoutArticleInput
    attachments?: ArticleAttachmentUncheckedCreateNestedManyWithoutArticleInput
  }

  export type ArticleCreateOrConnectWithoutLikesInput = {
    where: ArticleWhereUniqueInput
    create: XOR<ArticleCreateWithoutLikesInput, ArticleUncheckedCreateWithoutLikesInput>
  }

  export type ArticleUpsertWithoutLikesInput = {
    update: XOR<ArticleUpdateWithoutLikesInput, ArticleUncheckedUpdateWithoutLikesInput>
    create: XOR<ArticleCreateWithoutLikesInput, ArticleUncheckedCreateWithoutLikesInput>
    where?: ArticleWhereInput
  }

  export type ArticleUpdateToOneWithWhereWithoutLikesInput = {
    where?: ArticleWhereInput
    data: XOR<ArticleUpdateWithoutLikesInput, ArticleUncheckedUpdateWithoutLikesInput>
  }

  export type ArticleUpdateWithoutLikesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    authorId?: StringFieldUpdateOperationsInput | string
    status?: EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus
    visibility?: EnumArticleVisibilityFieldUpdateOperationsInput | $Enums.ArticleVisibility
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedReadTime?: NullableIntFieldUpdateOperationsInput | number | null
    difficulty?: EnumDifficultyLevelFieldUpdateOperationsInput | $Enums.DifficultyLevel
    viewCount?: IntFieldUpdateOperationsInput | number
    likeCount?: IntFieldUpdateOperationsInput | number
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: KnowledgeCategoryUpdateOneRequiredWithoutArticlesNestedInput
    comments?: ArticleCommentUpdateManyWithoutArticleNestedInput
    views?: ArticleViewUpdateManyWithoutArticleNestedInput
    revisions?: ArticleRevisionUpdateManyWithoutArticleNestedInput
    attachments?: ArticleAttachmentUpdateManyWithoutArticleNestedInput
  }

  export type ArticleUncheckedUpdateWithoutLikesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    categoryId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    status?: EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus
    visibility?: EnumArticleVisibilityFieldUpdateOperationsInput | $Enums.ArticleVisibility
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedReadTime?: NullableIntFieldUpdateOperationsInput | number | null
    difficulty?: EnumDifficultyLevelFieldUpdateOperationsInput | $Enums.DifficultyLevel
    viewCount?: IntFieldUpdateOperationsInput | number
    likeCount?: IntFieldUpdateOperationsInput | number
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: ArticleCommentUncheckedUpdateManyWithoutArticleNestedInput
    views?: ArticleViewUncheckedUpdateManyWithoutArticleNestedInput
    revisions?: ArticleRevisionUncheckedUpdateManyWithoutArticleNestedInput
    attachments?: ArticleAttachmentUncheckedUpdateManyWithoutArticleNestedInput
  }

  export type ArticleCreateWithoutViewsInput = {
    id?: string
    title: string
    content: string
    summary?: string | null
    authorId: string
    status?: $Enums.ArticleStatus
    visibility?: $Enums.ArticleVisibility
    tags?: string | null
    keywords?: string | null
    estimatedReadTime?: number | null
    difficulty?: $Enums.DifficultyLevel
    viewCount?: number
    likeCount?: number
    reviewerId?: string | null
    reviewedAt?: Date | string | null
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    category: KnowledgeCategoryCreateNestedOneWithoutArticlesInput
    comments?: ArticleCommentCreateNestedManyWithoutArticleInput
    likes?: ArticleLikeCreateNestedManyWithoutArticleInput
    revisions?: ArticleRevisionCreateNestedManyWithoutArticleInput
    attachments?: ArticleAttachmentCreateNestedManyWithoutArticleInput
  }

  export type ArticleUncheckedCreateWithoutViewsInput = {
    id?: string
    title: string
    content: string
    summary?: string | null
    categoryId: string
    authorId: string
    status?: $Enums.ArticleStatus
    visibility?: $Enums.ArticleVisibility
    tags?: string | null
    keywords?: string | null
    estimatedReadTime?: number | null
    difficulty?: $Enums.DifficultyLevel
    viewCount?: number
    likeCount?: number
    reviewerId?: string | null
    reviewedAt?: Date | string | null
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    comments?: ArticleCommentUncheckedCreateNestedManyWithoutArticleInput
    likes?: ArticleLikeUncheckedCreateNestedManyWithoutArticleInput
    revisions?: ArticleRevisionUncheckedCreateNestedManyWithoutArticleInput
    attachments?: ArticleAttachmentUncheckedCreateNestedManyWithoutArticleInput
  }

  export type ArticleCreateOrConnectWithoutViewsInput = {
    where: ArticleWhereUniqueInput
    create: XOR<ArticleCreateWithoutViewsInput, ArticleUncheckedCreateWithoutViewsInput>
  }

  export type ArticleUpsertWithoutViewsInput = {
    update: XOR<ArticleUpdateWithoutViewsInput, ArticleUncheckedUpdateWithoutViewsInput>
    create: XOR<ArticleCreateWithoutViewsInput, ArticleUncheckedCreateWithoutViewsInput>
    where?: ArticleWhereInput
  }

  export type ArticleUpdateToOneWithWhereWithoutViewsInput = {
    where?: ArticleWhereInput
    data: XOR<ArticleUpdateWithoutViewsInput, ArticleUncheckedUpdateWithoutViewsInput>
  }

  export type ArticleUpdateWithoutViewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    authorId?: StringFieldUpdateOperationsInput | string
    status?: EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus
    visibility?: EnumArticleVisibilityFieldUpdateOperationsInput | $Enums.ArticleVisibility
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedReadTime?: NullableIntFieldUpdateOperationsInput | number | null
    difficulty?: EnumDifficultyLevelFieldUpdateOperationsInput | $Enums.DifficultyLevel
    viewCount?: IntFieldUpdateOperationsInput | number
    likeCount?: IntFieldUpdateOperationsInput | number
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: KnowledgeCategoryUpdateOneRequiredWithoutArticlesNestedInput
    comments?: ArticleCommentUpdateManyWithoutArticleNestedInput
    likes?: ArticleLikeUpdateManyWithoutArticleNestedInput
    revisions?: ArticleRevisionUpdateManyWithoutArticleNestedInput
    attachments?: ArticleAttachmentUpdateManyWithoutArticleNestedInput
  }

  export type ArticleUncheckedUpdateWithoutViewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    categoryId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    status?: EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus
    visibility?: EnumArticleVisibilityFieldUpdateOperationsInput | $Enums.ArticleVisibility
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedReadTime?: NullableIntFieldUpdateOperationsInput | number | null
    difficulty?: EnumDifficultyLevelFieldUpdateOperationsInput | $Enums.DifficultyLevel
    viewCount?: IntFieldUpdateOperationsInput | number
    likeCount?: IntFieldUpdateOperationsInput | number
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: ArticleCommentUncheckedUpdateManyWithoutArticleNestedInput
    likes?: ArticleLikeUncheckedUpdateManyWithoutArticleNestedInput
    revisions?: ArticleRevisionUncheckedUpdateManyWithoutArticleNestedInput
    attachments?: ArticleAttachmentUncheckedUpdateManyWithoutArticleNestedInput
  }

  export type ArticleCreateWithoutAttachmentsInput = {
    id?: string
    title: string
    content: string
    summary?: string | null
    authorId: string
    status?: $Enums.ArticleStatus
    visibility?: $Enums.ArticleVisibility
    tags?: string | null
    keywords?: string | null
    estimatedReadTime?: number | null
    difficulty?: $Enums.DifficultyLevel
    viewCount?: number
    likeCount?: number
    reviewerId?: string | null
    reviewedAt?: Date | string | null
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    category: KnowledgeCategoryCreateNestedOneWithoutArticlesInput
    comments?: ArticleCommentCreateNestedManyWithoutArticleInput
    likes?: ArticleLikeCreateNestedManyWithoutArticleInput
    views?: ArticleViewCreateNestedManyWithoutArticleInput
    revisions?: ArticleRevisionCreateNestedManyWithoutArticleInput
  }

  export type ArticleUncheckedCreateWithoutAttachmentsInput = {
    id?: string
    title: string
    content: string
    summary?: string | null
    categoryId: string
    authorId: string
    status?: $Enums.ArticleStatus
    visibility?: $Enums.ArticleVisibility
    tags?: string | null
    keywords?: string | null
    estimatedReadTime?: number | null
    difficulty?: $Enums.DifficultyLevel
    viewCount?: number
    likeCount?: number
    reviewerId?: string | null
    reviewedAt?: Date | string | null
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    comments?: ArticleCommentUncheckedCreateNestedManyWithoutArticleInput
    likes?: ArticleLikeUncheckedCreateNestedManyWithoutArticleInput
    views?: ArticleViewUncheckedCreateNestedManyWithoutArticleInput
    revisions?: ArticleRevisionUncheckedCreateNestedManyWithoutArticleInput
  }

  export type ArticleCreateOrConnectWithoutAttachmentsInput = {
    where: ArticleWhereUniqueInput
    create: XOR<ArticleCreateWithoutAttachmentsInput, ArticleUncheckedCreateWithoutAttachmentsInput>
  }

  export type ArticleUpsertWithoutAttachmentsInput = {
    update: XOR<ArticleUpdateWithoutAttachmentsInput, ArticleUncheckedUpdateWithoutAttachmentsInput>
    create: XOR<ArticleCreateWithoutAttachmentsInput, ArticleUncheckedCreateWithoutAttachmentsInput>
    where?: ArticleWhereInput
  }

  export type ArticleUpdateToOneWithWhereWithoutAttachmentsInput = {
    where?: ArticleWhereInput
    data: XOR<ArticleUpdateWithoutAttachmentsInput, ArticleUncheckedUpdateWithoutAttachmentsInput>
  }

  export type ArticleUpdateWithoutAttachmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    authorId?: StringFieldUpdateOperationsInput | string
    status?: EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus
    visibility?: EnumArticleVisibilityFieldUpdateOperationsInput | $Enums.ArticleVisibility
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedReadTime?: NullableIntFieldUpdateOperationsInput | number | null
    difficulty?: EnumDifficultyLevelFieldUpdateOperationsInput | $Enums.DifficultyLevel
    viewCount?: IntFieldUpdateOperationsInput | number
    likeCount?: IntFieldUpdateOperationsInput | number
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: KnowledgeCategoryUpdateOneRequiredWithoutArticlesNestedInput
    comments?: ArticleCommentUpdateManyWithoutArticleNestedInput
    likes?: ArticleLikeUpdateManyWithoutArticleNestedInput
    views?: ArticleViewUpdateManyWithoutArticleNestedInput
    revisions?: ArticleRevisionUpdateManyWithoutArticleNestedInput
  }

  export type ArticleUncheckedUpdateWithoutAttachmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    categoryId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    status?: EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus
    visibility?: EnumArticleVisibilityFieldUpdateOperationsInput | $Enums.ArticleVisibility
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedReadTime?: NullableIntFieldUpdateOperationsInput | number | null
    difficulty?: EnumDifficultyLevelFieldUpdateOperationsInput | $Enums.DifficultyLevel
    viewCount?: IntFieldUpdateOperationsInput | number
    likeCount?: IntFieldUpdateOperationsInput | number
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: ArticleCommentUncheckedUpdateManyWithoutArticleNestedInput
    likes?: ArticleLikeUncheckedUpdateManyWithoutArticleNestedInput
    views?: ArticleViewUncheckedUpdateManyWithoutArticleNestedInput
    revisions?: ArticleRevisionUncheckedUpdateManyWithoutArticleNestedInput
  }

  export type KnowledgeCategoryCreateWithoutTemplatesInput = {
    id?: string
    name: string
    description?: string | null
    icon?: string | null
    color?: string | null
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    parent?: KnowledgeCategoryCreateNestedOneWithoutChildrenInput
    children?: KnowledgeCategoryCreateNestedManyWithoutParentInput
    articles?: ArticleCreateNestedManyWithoutCategoryInput
    faqs?: FAQCreateNestedManyWithoutCategoryInput
  }

  export type KnowledgeCategoryUncheckedCreateWithoutTemplatesInput = {
    id?: string
    name: string
    description?: string | null
    icon?: string | null
    color?: string | null
    order?: number
    parentId?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: KnowledgeCategoryUncheckedCreateNestedManyWithoutParentInput
    articles?: ArticleUncheckedCreateNestedManyWithoutCategoryInput
    faqs?: FAQUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type KnowledgeCategoryCreateOrConnectWithoutTemplatesInput = {
    where: KnowledgeCategoryWhereUniqueInput
    create: XOR<KnowledgeCategoryCreateWithoutTemplatesInput, KnowledgeCategoryUncheckedCreateWithoutTemplatesInput>
  }

  export type KnowledgeCategoryUpsertWithoutTemplatesInput = {
    update: XOR<KnowledgeCategoryUpdateWithoutTemplatesInput, KnowledgeCategoryUncheckedUpdateWithoutTemplatesInput>
    create: XOR<KnowledgeCategoryCreateWithoutTemplatesInput, KnowledgeCategoryUncheckedCreateWithoutTemplatesInput>
    where?: KnowledgeCategoryWhereInput
  }

  export type KnowledgeCategoryUpdateToOneWithWhereWithoutTemplatesInput = {
    where?: KnowledgeCategoryWhereInput
    data: XOR<KnowledgeCategoryUpdateWithoutTemplatesInput, KnowledgeCategoryUncheckedUpdateWithoutTemplatesInput>
  }

  export type KnowledgeCategoryUpdateWithoutTemplatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: KnowledgeCategoryUpdateOneWithoutChildrenNestedInput
    children?: KnowledgeCategoryUpdateManyWithoutParentNestedInput
    articles?: ArticleUpdateManyWithoutCategoryNestedInput
    faqs?: FAQUpdateManyWithoutCategoryNestedInput
  }

  export type KnowledgeCategoryUncheckedUpdateWithoutTemplatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: KnowledgeCategoryUncheckedUpdateManyWithoutParentNestedInput
    articles?: ArticleUncheckedUpdateManyWithoutCategoryNestedInput
    faqs?: FAQUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type KnowledgeCategoryCreateWithoutFaqsInput = {
    id?: string
    name: string
    description?: string | null
    icon?: string | null
    color?: string | null
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    parent?: KnowledgeCategoryCreateNestedOneWithoutChildrenInput
    children?: KnowledgeCategoryCreateNestedManyWithoutParentInput
    articles?: ArticleCreateNestedManyWithoutCategoryInput
    templates?: TemplateCreateNestedManyWithoutCategoryInput
  }

  export type KnowledgeCategoryUncheckedCreateWithoutFaqsInput = {
    id?: string
    name: string
    description?: string | null
    icon?: string | null
    color?: string | null
    order?: number
    parentId?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    children?: KnowledgeCategoryUncheckedCreateNestedManyWithoutParentInput
    articles?: ArticleUncheckedCreateNestedManyWithoutCategoryInput
    templates?: TemplateUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type KnowledgeCategoryCreateOrConnectWithoutFaqsInput = {
    where: KnowledgeCategoryWhereUniqueInput
    create: XOR<KnowledgeCategoryCreateWithoutFaqsInput, KnowledgeCategoryUncheckedCreateWithoutFaqsInput>
  }

  export type FAQFeedbackCreateWithoutFaqInput = {
    id?: string
    userId: string
    isHelpful: boolean
    comment?: string | null
    createdAt?: Date | string
  }

  export type FAQFeedbackUncheckedCreateWithoutFaqInput = {
    id?: string
    userId: string
    isHelpful: boolean
    comment?: string | null
    createdAt?: Date | string
  }

  export type FAQFeedbackCreateOrConnectWithoutFaqInput = {
    where: FAQFeedbackWhereUniqueInput
    create: XOR<FAQFeedbackCreateWithoutFaqInput, FAQFeedbackUncheckedCreateWithoutFaqInput>
  }

  export type FAQFeedbackCreateManyFaqInputEnvelope = {
    data: FAQFeedbackCreateManyFaqInput | FAQFeedbackCreateManyFaqInput[]
  }

  export type KnowledgeCategoryUpsertWithoutFaqsInput = {
    update: XOR<KnowledgeCategoryUpdateWithoutFaqsInput, KnowledgeCategoryUncheckedUpdateWithoutFaqsInput>
    create: XOR<KnowledgeCategoryCreateWithoutFaqsInput, KnowledgeCategoryUncheckedCreateWithoutFaqsInput>
    where?: KnowledgeCategoryWhereInput
  }

  export type KnowledgeCategoryUpdateToOneWithWhereWithoutFaqsInput = {
    where?: KnowledgeCategoryWhereInput
    data: XOR<KnowledgeCategoryUpdateWithoutFaqsInput, KnowledgeCategoryUncheckedUpdateWithoutFaqsInput>
  }

  export type KnowledgeCategoryUpdateWithoutFaqsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: KnowledgeCategoryUpdateOneWithoutChildrenNestedInput
    children?: KnowledgeCategoryUpdateManyWithoutParentNestedInput
    articles?: ArticleUpdateManyWithoutCategoryNestedInput
    templates?: TemplateUpdateManyWithoutCategoryNestedInput
  }

  export type KnowledgeCategoryUncheckedUpdateWithoutFaqsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: KnowledgeCategoryUncheckedUpdateManyWithoutParentNestedInput
    articles?: ArticleUncheckedUpdateManyWithoutCategoryNestedInput
    templates?: TemplateUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type FAQFeedbackUpsertWithWhereUniqueWithoutFaqInput = {
    where: FAQFeedbackWhereUniqueInput
    update: XOR<FAQFeedbackUpdateWithoutFaqInput, FAQFeedbackUncheckedUpdateWithoutFaqInput>
    create: XOR<FAQFeedbackCreateWithoutFaqInput, FAQFeedbackUncheckedCreateWithoutFaqInput>
  }

  export type FAQFeedbackUpdateWithWhereUniqueWithoutFaqInput = {
    where: FAQFeedbackWhereUniqueInput
    data: XOR<FAQFeedbackUpdateWithoutFaqInput, FAQFeedbackUncheckedUpdateWithoutFaqInput>
  }

  export type FAQFeedbackUpdateManyWithWhereWithoutFaqInput = {
    where: FAQFeedbackScalarWhereInput
    data: XOR<FAQFeedbackUpdateManyMutationInput, FAQFeedbackUncheckedUpdateManyWithoutFaqInput>
  }

  export type FAQFeedbackScalarWhereInput = {
    AND?: FAQFeedbackScalarWhereInput | FAQFeedbackScalarWhereInput[]
    OR?: FAQFeedbackScalarWhereInput[]
    NOT?: FAQFeedbackScalarWhereInput | FAQFeedbackScalarWhereInput[]
    id?: StringFilter<"FAQFeedback"> | string
    faqId?: StringFilter<"FAQFeedback"> | string
    userId?: StringFilter<"FAQFeedback"> | string
    isHelpful?: BoolFilter<"FAQFeedback"> | boolean
    comment?: StringNullableFilter<"FAQFeedback"> | string | null
    createdAt?: DateTimeFilter<"FAQFeedback"> | Date | string
  }

  export type FAQCreateWithoutFeedbackInput = {
    id?: string
    question: string
    answer: string
    authorId: string
    viewCount?: number
    helpfulCount?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    category: KnowledgeCategoryCreateNestedOneWithoutFaqsInput
  }

  export type FAQUncheckedCreateWithoutFeedbackInput = {
    id?: string
    question: string
    answer: string
    categoryId: string
    authorId: string
    viewCount?: number
    helpfulCount?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FAQCreateOrConnectWithoutFeedbackInput = {
    where: FAQWhereUniqueInput
    create: XOR<FAQCreateWithoutFeedbackInput, FAQUncheckedCreateWithoutFeedbackInput>
  }

  export type FAQUpsertWithoutFeedbackInput = {
    update: XOR<FAQUpdateWithoutFeedbackInput, FAQUncheckedUpdateWithoutFeedbackInput>
    create: XOR<FAQCreateWithoutFeedbackInput, FAQUncheckedCreateWithoutFeedbackInput>
    where?: FAQWhereInput
  }

  export type FAQUpdateToOneWithWhereWithoutFeedbackInput = {
    where?: FAQWhereInput
    data: XOR<FAQUpdateWithoutFeedbackInput, FAQUncheckedUpdateWithoutFeedbackInput>
  }

  export type FAQUpdateWithoutFeedbackInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    answer?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    viewCount?: IntFieldUpdateOperationsInput | number
    helpfulCount?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: KnowledgeCategoryUpdateOneRequiredWithoutFaqsNestedInput
  }

  export type FAQUncheckedUpdateWithoutFeedbackInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    answer?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    viewCount?: IntFieldUpdateOperationsInput | number
    helpfulCount?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExpertReviewCreateWithoutExpertInput = {
    id?: string
    reviewerId: string
    rating: number
    comment?: string | null
    createdAt?: Date | string
  }

  export type ExpertReviewUncheckedCreateWithoutExpertInput = {
    id?: string
    reviewerId: string
    rating: number
    comment?: string | null
    createdAt?: Date | string
  }

  export type ExpertReviewCreateOrConnectWithoutExpertInput = {
    where: ExpertReviewWhereUniqueInput
    create: XOR<ExpertReviewCreateWithoutExpertInput, ExpertReviewUncheckedCreateWithoutExpertInput>
  }

  export type ExpertReviewCreateManyExpertInputEnvelope = {
    data: ExpertReviewCreateManyExpertInput | ExpertReviewCreateManyExpertInput[]
  }

  export type ExpertReviewUpsertWithWhereUniqueWithoutExpertInput = {
    where: ExpertReviewWhereUniqueInput
    update: XOR<ExpertReviewUpdateWithoutExpertInput, ExpertReviewUncheckedUpdateWithoutExpertInput>
    create: XOR<ExpertReviewCreateWithoutExpertInput, ExpertReviewUncheckedCreateWithoutExpertInput>
  }

  export type ExpertReviewUpdateWithWhereUniqueWithoutExpertInput = {
    where: ExpertReviewWhereUniqueInput
    data: XOR<ExpertReviewUpdateWithoutExpertInput, ExpertReviewUncheckedUpdateWithoutExpertInput>
  }

  export type ExpertReviewUpdateManyWithWhereWithoutExpertInput = {
    where: ExpertReviewScalarWhereInput
    data: XOR<ExpertReviewUpdateManyMutationInput, ExpertReviewUncheckedUpdateManyWithoutExpertInput>
  }

  export type ExpertReviewScalarWhereInput = {
    AND?: ExpertReviewScalarWhereInput | ExpertReviewScalarWhereInput[]
    OR?: ExpertReviewScalarWhereInput[]
    NOT?: ExpertReviewScalarWhereInput | ExpertReviewScalarWhereInput[]
    id?: StringFilter<"ExpertReview"> | string
    expertId?: StringFilter<"ExpertReview"> | string
    reviewerId?: StringFilter<"ExpertReview"> | string
    rating?: IntFilter<"ExpertReview"> | number
    comment?: StringNullableFilter<"ExpertReview"> | string | null
    createdAt?: DateTimeFilter<"ExpertReview"> | Date | string
  }

  export type ExpertCreateWithoutReviewsInput = {
    id?: string
    userId: string
    bio?: string | null
    specialties: string
    certifications?: string | null
    experience?: string | null
    contactInfo?: string | null
    rating?: number
    reviewCount?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExpertUncheckedCreateWithoutReviewsInput = {
    id?: string
    userId: string
    bio?: string | null
    specialties: string
    certifications?: string | null
    experience?: string | null
    contactInfo?: string | null
    rating?: number
    reviewCount?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExpertCreateOrConnectWithoutReviewsInput = {
    where: ExpertWhereUniqueInput
    create: XOR<ExpertCreateWithoutReviewsInput, ExpertUncheckedCreateWithoutReviewsInput>
  }

  export type ExpertUpsertWithoutReviewsInput = {
    update: XOR<ExpertUpdateWithoutReviewsInput, ExpertUncheckedUpdateWithoutReviewsInput>
    create: XOR<ExpertCreateWithoutReviewsInput, ExpertUncheckedCreateWithoutReviewsInput>
    where?: ExpertWhereInput
  }

  export type ExpertUpdateToOneWithWhereWithoutReviewsInput = {
    where?: ExpertWhereInput
    data: XOR<ExpertUpdateWithoutReviewsInput, ExpertUncheckedUpdateWithoutReviewsInput>
  }

  export type ExpertUpdateWithoutReviewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    specialties?: StringFieldUpdateOperationsInput | string
    certifications?: NullableStringFieldUpdateOperationsInput | string | null
    experience?: NullableStringFieldUpdateOperationsInput | string | null
    contactInfo?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: FloatFieldUpdateOperationsInput | number
    reviewCount?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExpertUncheckedUpdateWithoutReviewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    specialties?: StringFieldUpdateOperationsInput | string
    certifications?: NullableStringFieldUpdateOperationsInput | string | null
    experience?: NullableStringFieldUpdateOperationsInput | string | null
    contactInfo?: NullableStringFieldUpdateOperationsInput | string | null
    rating?: FloatFieldUpdateOperationsInput | number
    reviewCount?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KnowledgeCategoryCreateManyParentInput = {
    id?: string
    name: string
    description?: string | null
    icon?: string | null
    color?: string | null
    order?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ArticleCreateManyCategoryInput = {
    id?: string
    title: string
    content: string
    summary?: string | null
    authorId: string
    status?: $Enums.ArticleStatus
    visibility?: $Enums.ArticleVisibility
    tags?: string | null
    keywords?: string | null
    estimatedReadTime?: number | null
    difficulty?: $Enums.DifficultyLevel
    viewCount?: number
    likeCount?: number
    reviewerId?: string | null
    reviewedAt?: Date | string | null
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TemplateCreateManyCategoryInput = {
    id?: string
    name: string
    description?: string | null
    content: string
    authorId: string
    type: $Enums.TemplateType
    tags?: string | null
    variables?: string | null
    useCount?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FAQCreateManyCategoryInput = {
    id?: string
    question: string
    answer: string
    authorId: string
    viewCount?: number
    helpfulCount?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KnowledgeCategoryUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: KnowledgeCategoryUpdateManyWithoutParentNestedInput
    articles?: ArticleUpdateManyWithoutCategoryNestedInput
    templates?: TemplateUpdateManyWithoutCategoryNestedInput
    faqs?: FAQUpdateManyWithoutCategoryNestedInput
  }

  export type KnowledgeCategoryUncheckedUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: KnowledgeCategoryUncheckedUpdateManyWithoutParentNestedInput
    articles?: ArticleUncheckedUpdateManyWithoutCategoryNestedInput
    templates?: TemplateUncheckedUpdateManyWithoutCategoryNestedInput
    faqs?: FAQUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type KnowledgeCategoryUncheckedUpdateManyWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    authorId?: StringFieldUpdateOperationsInput | string
    status?: EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus
    visibility?: EnumArticleVisibilityFieldUpdateOperationsInput | $Enums.ArticleVisibility
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedReadTime?: NullableIntFieldUpdateOperationsInput | number | null
    difficulty?: EnumDifficultyLevelFieldUpdateOperationsInput | $Enums.DifficultyLevel
    viewCount?: IntFieldUpdateOperationsInput | number
    likeCount?: IntFieldUpdateOperationsInput | number
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: ArticleCommentUpdateManyWithoutArticleNestedInput
    likes?: ArticleLikeUpdateManyWithoutArticleNestedInput
    views?: ArticleViewUpdateManyWithoutArticleNestedInput
    revisions?: ArticleRevisionUpdateManyWithoutArticleNestedInput
    attachments?: ArticleAttachmentUpdateManyWithoutArticleNestedInput
  }

  export type ArticleUncheckedUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    authorId?: StringFieldUpdateOperationsInput | string
    status?: EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus
    visibility?: EnumArticleVisibilityFieldUpdateOperationsInput | $Enums.ArticleVisibility
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedReadTime?: NullableIntFieldUpdateOperationsInput | number | null
    difficulty?: EnumDifficultyLevelFieldUpdateOperationsInput | $Enums.DifficultyLevel
    viewCount?: IntFieldUpdateOperationsInput | number
    likeCount?: IntFieldUpdateOperationsInput | number
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: ArticleCommentUncheckedUpdateManyWithoutArticleNestedInput
    likes?: ArticleLikeUncheckedUpdateManyWithoutArticleNestedInput
    views?: ArticleViewUncheckedUpdateManyWithoutArticleNestedInput
    revisions?: ArticleRevisionUncheckedUpdateManyWithoutArticleNestedInput
    attachments?: ArticleAttachmentUncheckedUpdateManyWithoutArticleNestedInput
  }

  export type ArticleUncheckedUpdateManyWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    authorId?: StringFieldUpdateOperationsInput | string
    status?: EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus
    visibility?: EnumArticleVisibilityFieldUpdateOperationsInput | $Enums.ArticleVisibility
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    keywords?: NullableStringFieldUpdateOperationsInput | string | null
    estimatedReadTime?: NullableIntFieldUpdateOperationsInput | number | null
    difficulty?: EnumDifficultyLevelFieldUpdateOperationsInput | $Enums.DifficultyLevel
    viewCount?: IntFieldUpdateOperationsInput | number
    likeCount?: IntFieldUpdateOperationsInput | number
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TemplateUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    type?: EnumTemplateTypeFieldUpdateOperationsInput | $Enums.TemplateType
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    variables?: NullableStringFieldUpdateOperationsInput | string | null
    useCount?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TemplateUncheckedUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    type?: EnumTemplateTypeFieldUpdateOperationsInput | $Enums.TemplateType
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    variables?: NullableStringFieldUpdateOperationsInput | string | null
    useCount?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TemplateUncheckedUpdateManyWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    type?: EnumTemplateTypeFieldUpdateOperationsInput | $Enums.TemplateType
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    variables?: NullableStringFieldUpdateOperationsInput | string | null
    useCount?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FAQUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    answer?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    viewCount?: IntFieldUpdateOperationsInput | number
    helpfulCount?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    feedback?: FAQFeedbackUpdateManyWithoutFaqNestedInput
  }

  export type FAQUncheckedUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    answer?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    viewCount?: IntFieldUpdateOperationsInput | number
    helpfulCount?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    feedback?: FAQFeedbackUncheckedUpdateManyWithoutFaqNestedInput
  }

  export type FAQUncheckedUpdateManyWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    answer?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    viewCount?: IntFieldUpdateOperationsInput | number
    helpfulCount?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleCommentCreateManyArticleInput = {
    id?: string
    authorId: string
    content: string
    parentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ArticleLikeCreateManyArticleInput = {
    id?: string
    userId: string
    createdAt?: Date | string
  }

  export type ArticleViewCreateManyArticleInput = {
    id?: string
    userId: string
    duration?: number | null
    viewedAt?: Date | string
  }

  export type ArticleRevisionCreateManyArticleInput = {
    id?: string
    version: number
    title: string
    content: string
    summary?: string | null
    changes?: string | null
    authorId: string
    createdAt?: Date | string
  }

  export type ArticleAttachmentCreateManyArticleInput = {
    id?: string
    filename: string
    originalName: string
    mimeType: string
    size: number
    url: string
    createdAt?: Date | string
  }

  export type ArticleCommentUpdateWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: ArticleCommentUpdateOneWithoutRepliesNestedInput
    replies?: ArticleCommentUpdateManyWithoutParentNestedInput
  }

  export type ArticleCommentUncheckedUpdateWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: ArticleCommentUncheckedUpdateManyWithoutParentNestedInput
  }

  export type ArticleCommentUncheckedUpdateManyWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleLikeUpdateWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleLikeUncheckedUpdateWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleLikeUncheckedUpdateManyWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleViewUpdateWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleViewUncheckedUpdateWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleViewUncheckedUpdateManyWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    viewedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleRevisionUpdateWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    changes?: NullableStringFieldUpdateOperationsInput | string | null
    authorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleRevisionUncheckedUpdateWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    changes?: NullableStringFieldUpdateOperationsInput | string | null
    authorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleRevisionUncheckedUpdateManyWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    changes?: NullableStringFieldUpdateOperationsInput | string | null
    authorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleAttachmentUpdateWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleAttachmentUncheckedUpdateWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleAttachmentUncheckedUpdateManyWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleCommentCreateManyParentInput = {
    id?: string
    articleId: string
    authorId: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ArticleCommentUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    article?: ArticleUpdateOneRequiredWithoutCommentsNestedInput
    replies?: ArticleCommentUpdateManyWithoutParentNestedInput
  }

  export type ArticleCommentUncheckedUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: ArticleCommentUncheckedUpdateManyWithoutParentNestedInput
  }

  export type ArticleCommentUncheckedUpdateManyWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FAQFeedbackCreateManyFaqInput = {
    id?: string
    userId: string
    isHelpful: boolean
    comment?: string | null
    createdAt?: Date | string
  }

  export type FAQFeedbackUpdateWithoutFaqInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    isHelpful?: BoolFieldUpdateOperationsInput | boolean
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FAQFeedbackUncheckedUpdateWithoutFaqInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    isHelpful?: BoolFieldUpdateOperationsInput | boolean
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FAQFeedbackUncheckedUpdateManyWithoutFaqInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    isHelpful?: BoolFieldUpdateOperationsInput | boolean
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExpertReviewCreateManyExpertInput = {
    id?: string
    reviewerId: string
    rating: number
    comment?: string | null
    createdAt?: Date | string
  }

  export type ExpertReviewUpdateWithoutExpertInput = {
    id?: StringFieldUpdateOperationsInput | string
    reviewerId?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExpertReviewUncheckedUpdateWithoutExpertInput = {
    id?: StringFieldUpdateOperationsInput | string
    reviewerId?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExpertReviewUncheckedUpdateManyWithoutExpertInput = {
    id?: StringFieldUpdateOperationsInput | string
    reviewerId?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    comment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}