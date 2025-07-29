export abstract class DateHelper {
  static format(date: string | Date, format: string = 'dd/MM/yyyy'): string | Date {
    if (!date) return '';

    if (format === 'dd/MM/yyyy') {
      return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    }

    return date;
  }
}
