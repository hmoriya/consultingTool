# 共有値オブジェクト

**更新日: 2025-01-13**

## 概要
全マイクロサービスで共通して使用される値オブジェクトを定義する。

## 基本的な値オブジェクト

### Money（金額）
```
Money {
  amount: number
  currency: Currency
  
  // メソッド
  add(money: Money): Money
  subtract(money: Money): Money
  multiply(factor: number): Money
  divide(divisor: number): Money
  equals(money: Money): boolean
  isGreaterThan(money: Money): boolean
  isLessThan(money: Money): boolean
  isZero(): boolean
  isNegative(): boolean
  convert(toCurrency: Currency, rate: number): Money
  format(locale?: string): string
  toString(): string
}

enum Currency {
  JPY = "JPY"
  USD = "USD"
  EUR = "EUR"
  GBP = "GBP"
  CNY = "CNY"
  KRW = "KRW"
  AUD = "AUD"
  CAD = "CAD"
}
```

### DateRange（期間）
```
DateRange {
  startDate: Date
  endDate: Date
  
  // メソッド
  duration(): number           // 日数
  durationInMonths(): number
  durationInYears(): number
  includes(date: Date): boolean
  overlaps(other: DateRange): boolean
  contains(other: DateRange): boolean
  isEmpty(): boolean
  isValid(): boolean
  extend(days: number): DateRange
  shift(days: number): DateRange
  intersection(other: DateRange): DateRange?
  union(other: DateRange): DateRange?
  workingDays(holidays?: Date[]): number
  months(): Month[]
  weeks(): Week[]
  days(): Date[]
  toString(): string
}
```

### Email（メールアドレス）
```
Email {
  value: string
  
  // メソッド
  validate(): boolean
  normalize(): string          // 小文字化、空白除去
  localPart(): string
  domain(): string
  isBusinessEmail(): boolean   // フリーメールでないか
  equals(other: Email): boolean
  toString(): string
  
  // 静的メソッド
  static isValid(email: string): boolean
  static fromString(email: string): Email
}
```

### PhoneNumber（電話番号）
```
PhoneNumber {
  countryCode: string
  nationalNumber: string
  extension?: string
  
  // メソッド
  validate(): boolean
  format(style: PhoneNumberFormat): string
  isInternational(): boolean
  isMobile(): boolean
  equals(other: PhoneNumber): boolean
  toString(): string
  
  // 静的メソッド
  static parse(number: string, defaultCountry?: string): PhoneNumber
}

enum PhoneNumberFormat {
  INTERNATIONAL   // +81 3-1234-5678
  NATIONAL       // 03-1234-5678
  E164           // +81312345678
}
```

### Address（住所）
```
Address {
  street1: string
  street2?: string
  city: string
  state?: string
  postalCode: string
  country: string
  
  // メソッド
  validate(): boolean
  format(style: AddressFormat): string
  equals(other: Address): boolean
  toString(): string
}

enum AddressFormat {
  SINGLE_LINE
  MULTI_LINE
  POSTAL
}
```

### PersonName（人名）
```
PersonName {
  firstName: string
  lastName: string
  middleName?: string
  preferredName?: string
  honorific?: string      // Mr., Ms., Dr., etc.
  suffix?: string         // Jr., III, etc.
  
  // メソッド
  fullName(format?: NameFormat): string
  initials(): string
  equals(other: PersonName): boolean
  toString(): string
}

enum NameFormat {
  WESTERN         // John Smith
  EASTERN         // Smith John
  FORMAL          // Mr. John Smith Jr.
}
```

### Percentage（パーセンテージ）
```
Percentage {
  value: number          // 0-100
  
  // メソッド
  validate(): boolean
  toDecimal(): number    // 0-1
  add(other: Percentage): Percentage
  subtract(other: Percentage): Percentage
  of(amount: number): number
  equals(other: Percentage): boolean
  toString(): string
  format(decimals?: number): string
}
```

### Quantity（数量）
```
Quantity {
  value: number
  unit: Unit
  
  // メソッド
  add(other: Quantity): Quantity
  subtract(other: Quantity): Quantity
  multiply(factor: number): Quantity
  divide(divisor: number): Quantity
  convert(toUnit: Unit): Quantity
  equals(other: Quantity): boolean
  isZero(): boolean
  toString(): string
}

interface Unit {
  name: string
  symbol: string
  type: UnitType
}

enum UnitType {
  TIME
  LENGTH
  WEIGHT
  VOLUME
  AREA
  COUNT
}
```

### TimeZone（タイムゾーン）
```
TimeZone {
  id: string             // "Asia/Tokyo", "America/New_York"
  offset: number         // UTCからの時差（分）
  
  // メソッド
  currentTime(): DateTime
  convert(dateTime: DateTime): DateTime
  isDST(date: Date): boolean
  getAbbreviation(): string    // "JST", "EST"
  equals(other: TimeZone): boolean
  toString(): string
}
```

### Language（言語）
```
Language {
  code: string           // ISO 639-1: "ja", "en"
  name: string
  nativeName: string
  script?: string        // ISO 15924
  region?: string        // ISO 3166-1
  
  // メソッド
  validate(): boolean
  getLocale(): string    // "ja-JP", "en-US"
  equals(other: Language): boolean
  toString(): string
}
```

### Color（色）
```
Color {
  red: number           // 0-255
  green: number         // 0-255
  blue: number          // 0-255
  alpha: number         // 0-1
  
  // メソッド
  toHex(): string       // "#RRGGBB"
  toRgb(): string       // "rgb(r, g, b)"
  toRgba(): string      // "rgba(r, g, b, a)"
  toHsl(): HSL
  lighten(amount: number): Color
  darken(amount: number): Color
  equals(other: Color): boolean
  toString(): string
}

interface HSL {
  hue: number          // 0-360
  saturation: number   // 0-100
  lightness: number    // 0-100
}
```

### FileSize（ファイルサイズ）
```
FileSize {
  bytes: number
  
  // メソッド
  toKilobytes(): number
  toMegabytes(): number
  toGigabytes(): number
  format(precision?: number): string    // "1.5 MB"
  equals(other: FileSize): boolean
  isLargerThan(other: FileSize): boolean
  toString(): string
  
  // 静的メソッド
  static fromKilobytes(kb: number): FileSize
  static fromMegabytes(mb: number): FileSize
  static fromGigabytes(gb: number): FileSize
}
```

### URL（URL）
```
URL {
  protocol: string
  hostname: string
  port?: number
  pathname: string
  search?: string
  hash?: string
  
  // メソッド
  validate(): boolean
  isSecure(): boolean
  getOrigin(): string
  getFullPath(): string
  addQueryParam(key: string, value: string): URL
  removeQueryParam(key: string): URL
  equals(other: URL): boolean
  toString(): string
  
  // 静的メソッド
  static parse(url: string): URL
  static isValid(url: string): boolean
}
```

### Version（バージョン）
```
Version {
  major: number
  minor: number
  patch: number
  preRelease?: string
  build?: string
  
  // メソッド
  increment(type: VersionIncrement): Version
  compare(other: Version): number
  isGreaterThan(other: Version): boolean
  isLessThan(other: Version): boolean
  isCompatible(other: Version): boolean
  equals(other: Version): boolean
  toString(): string      // "1.2.3-beta.1+build.123"
  
  // 静的メソッド
  static parse(version: string): Version
}

enum VersionIncrement {
  MAJOR
  MINOR
  PATCH
}
```

### GeoLocation（地理座標）
```
GeoLocation {
  latitude: number      // -90 to 90
  longitude: number     // -180 to 180
  altitude?: number     // meters
  accuracy?: number     // meters
  
  // メソッド
  validate(): boolean
  distanceTo(other: GeoLocation): number    // meters
  bearingTo(other: GeoLocation): number     // degrees
  midpointTo(other: GeoLocation): GeoLocation
  equals(other: GeoLocation, precision?: number): boolean
  toString(): string
  toGeoJSON(): object
}
```

### UUID（UUID）
```
UUID {
  value: string
  
  // メソッド
  validate(): boolean
  version(): number
  equals(other: UUID): boolean
  toString(): string
  
  // 静的メソッド
  static generate(): UUID
  static generateV4(): UUID
  static isValid(uuid: string): boolean
  static nil(): UUID
}
```

## ビジネス固有の値オブジェクト

### BusinessDay（営業日）
```
BusinessDay {
  date: Date
  calendar: BusinessCalendar
  
  // メソッド
  isWorkingDay(): boolean
  isHoliday(): boolean
  next(): BusinessDay
  previous(): BusinessDay
  addBusinessDays(days: number): BusinessDay
  businessDaysTo(other: BusinessDay): number
  equals(other: BusinessDay): boolean
  toString(): string
}

interface BusinessCalendar {
  country: string
  holidays: Date[]
  workingDays: DayOfWeek[]
}
```

### FiscalPeriod（会計期間）
```
FiscalPeriod {
  year: number
  quarter?: number
  month?: number
  startDate: Date
  endDate: Date
  
  // メソッド
  contains(date: Date): boolean
  next(): FiscalPeriod
  previous(): FiscalPeriod
  toDateRange(): DateRange
  equals(other: FiscalPeriod): boolean
  toString(): string      // "FY2024", "FY2024-Q1", "FY2024-04"
}
```

### EmployeeID（従業員ID）
```
EmployeeID {
  value: string
  prefix?: string
  
  // メソッド
  validate(): boolean
  format(): string
  equals(other: EmployeeID): boolean
  toString(): string
  
  // 静的メソッド
  static generate(prefix?: string): EmployeeID
  static isValid(id: string): boolean
}
```

### ProjectCode（プロジェクトコード）
```
ProjectCode {
  value: string
  
  // メソッド
  validate(): boolean
  getYear(): string
  getSequence(): number
  getCategory(): string
  equals(other: ProjectCode): boolean
  toString(): string
  
  // 静的メソッド
  static generate(category: string): ProjectCode
  static parse(code: string): ProjectCode
}
```

## ユーティリティタイプ

### Result（結果型）
```
Result<T, E> {
  isSuccess: boolean
  isFailure: boolean
  value?: T
  error?: E
  
  // メソッド
  map<U>(fn: (value: T) => U): Result<U, E>
  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E>
  mapError<F>(fn: (error: E) => F): Result<T, F>
  match<U>(success: (value: T) => U, failure: (error: E) => U): U
  getOrElse(defaultValue: T): T
  getOrThrow(): T
  
  // 静的メソッド
  static ok<T>(value: T): Result<T, never>
  static fail<E>(error: E): Result<never, E>
}
```

### Maybe（Maybe型）
```
Maybe<T> {
  hasValue: boolean
  value?: T
  
  // メソッド
  map<U>(fn: (value: T) => U): Maybe<U>
  flatMap<U>(fn: (value: T) => Maybe<U>): Maybe<U>
  filter(predicate: (value: T) => boolean): Maybe<T>
  getOrElse(defaultValue: T): T
  match<U>(some: (value: T) => U, none: () => U): U
  
  // 静的メソッド
  static some<T>(value: T): Maybe<T>
  static none<T>(): Maybe<T>
  static fromNullable<T>(value: T | null | undefined): Maybe<T>
}
```