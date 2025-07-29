export abstract class BooleanToStringHelper {
  static transform(value: boolean): string {
    return value ? 'Sim' : 'Não';
  }
}
