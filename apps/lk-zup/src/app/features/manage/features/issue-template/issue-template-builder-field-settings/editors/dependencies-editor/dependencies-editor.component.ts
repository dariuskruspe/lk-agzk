import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  OnDestroy,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FpcInputsInterface } from '@wafpc/base/models/fpc.interface';
import { InputTextModule } from 'primeng/inputtext';
import {
  SettingsGroupComponent,
  SettingsGroup,
} from '../../../../../../../shared/components/settings-group/settings-group.component';

// Интерфейс зависимости согласно документации
interface FieldDependency {
  id: string;
  control: string; // Обязательное поле - название зависимого поля
  condition?: string; // Условие отображения
  clone?: boolean; // Клонирование значения
  isNew?: boolean; // Флаг для новых зависимостей (не показывать валидацию)
}

// Используем общий интерфейс SettingsGroup

@Component({
    selector: 'app-dependencies-editor',
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        SettingsGroupComponent,
    ],
    templateUrl: './dependencies-editor.component.html',
    styleUrl: './dependencies-editor.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DependenciesEditorComponent implements OnDestroy {
  value = input<Partial<FpcInputsInterface>>({});
  valueChange = output<Partial<FpcInputsInterface>>();

  // Внутреннее состояние
  dependencies = signal<FieldDependency[]>([]);
  requiredToFillFields = signal<string[]>([]);

  // Флаг для предотвращения показа ошибок до полной инициализации
  isInitialized = signal<boolean>(false);

  // Конфигурация групп настроек
  groups: SettingsGroup[] = [
    {
      key: 'dependencies',
      title: 'Зависимости полей',
      icon: 'pi pi-link',
      description:
        'Настройка условий отображения и клонирования значений между полями',
    },
    {
      key: 'requiredFields',
      title: 'Обязательные поля',
      icon: 'pi pi-exclamation-triangle',
      description: 'Поля, которые должны быть заполнены для сохранения формы',
    },
    {
      key: 'help',
      title: 'Справка по синтаксису',
      icon: 'pi pi-question-circle',
      description: 'Доступные операторы и функции для составления условий',
    },
  ];

  // Справочная информация по синтаксису условий
  conditionSyntaxHelp = [
    { operator: '===', description: 'проверка равенства' },
    { operator: '!==', description: 'проверка неравенства' },
    { operator: '>', description: 'больше' },
    { operator: '<', description: 'меньше' },
    { operator: '<=', description: 'меньше или равно' },
    { operator: '>=', description: 'больше или равно' },
    { operator: '||', description: 'логическое "ИЛИ"' },
    { operator: '&&', description: 'логическое "И"' },
    { operator: '!', description: 'логическое "НЕ"' },
    { operator: '$V', description: 'значение текущего поля' },
    {
      operator: '$T',
      description: 'тип выбранной даты (holiday, workDay, dayOff)',
    },
    { operator: 'm()', description: 'преобразование в дату' },
    { operator: 'm().day()', description: 'день недели (0-ВС, 6-СБ)' },
  ];

  // Вычисляемое свойство для проверки валидности формы
  isFormValid = computed(() => {
    if (!this.isInitialized()) {
      return true; // Не проверяем валидность до инициализации
    }

    // Проверяем валидность всех зависимостей
    const deps = this.dependencies();
    return deps.every((dep) => this.isDependencyValid(dep));
  });

  // Проверка изменений в группах
  hasChangesInGroup = computed(() => {
    const deps = this.dependencies();
    const requiredFields = this.requiredToFillFields();

    return {
      dependencies: deps.length > 0,
      requiredFields: requiredFields.length > 0,
    };
  });

  constructor() {
    effect(
      () => {
        this.initializeFromValue();
      },
      { allowSignalWrites: true },
    );
  }

  private initializeFromValue() {
    const incomingValue = this.value();

    const deps = (incomingValue.dependent ?? []).map((d: any) => ({
      ...d,
      id: d.id || this.generateId(),
      isNew: false, // Существующие зависимости не новые
    }));
    this.dependencies.set(deps);

    const fields = incomingValue.requiredToFill ?? [];
    this.requiredToFillFields.set([...fields]);

    // Устанавливаем флаг инициализации после синхронизации данных
    setTimeout(() => this.isInitialized.set(true), 0);
  }

  private generateId(): string {
    return `dep_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  // Проверка изменений в группах
  hasGroupChanges(groupKey: string): boolean {
    const changes = this.hasChangesInGroup();
    return changes[groupKey as keyof typeof changes] || false;
  }

  // Работа с зависимостями
  addDependency() {
    const newDependency: FieldDependency = {
      id: this.generateId(),
      control: '',
      condition: '',
      clone: false,
      isNew: true, // Помечаем как новую зависимость
    };
    this.dependencies.update((deps) => [...deps, newDependency]);
  }

  removeDependency(index: number) {
    this.dependencies.update((deps) => deps.filter((_, i) => i !== index));
    this.emitChanges();
  }

  updateDependency(
    index: number,
    updates: Partial<FieldDependency>,
    shouldEmit: boolean = false,
  ) {
    this.dependencies.update((deps) =>
      deps.map((dep, i) => {
        if (i === index) {
          const updatedDep = { ...dep, ...updates };
          if (updates.clone === true) {
            updatedDep.condition = undefined;
          } else if (updates.condition !== undefined) {
            updatedDep.clone = false;
          }
          return updatedDep;
        }
        return dep;
      }),
    );

    // Эмитим изменения только если это явно запрошено
    if (shouldEmit) {
      this.emitChanges();
    }
  }

  updateControlName(index: number, event: Event) {
    const target = event.target as HTMLInputElement;
    this.updateDependency(index, { control: target.value });
  }

  updateCondition(index: number, event: Event) {
    const target = event.target as HTMLInputElement;
    this.updateDependency(index, { condition: target.value });
  }

  // Методы для blur событий - эмитят изменения только если валидация прошла
  onControlNameBlur(index: number, event: Event) {
    const target = event.target as HTMLInputElement;
    const dependency = this.dependencies()[index];

    // Обновляем значение и убираем флаг isNew
    this.updateDependency(index, { control: target.value, isNew: false });

    // Эмитим изменения только если зависимость валидна
    const updatedDep = { ...dependency, control: target.value, isNew: false };
    if (this.isDependencyValid(updatedDep)) {
      this.emitChanges();
    }
  }

  onConditionBlur(index: number, event: Event) {
    const target = event.target as HTMLInputElement;
    const dependency = this.dependencies()[index];

    // Обновляем значение и убираем флаг isNew
    this.updateDependency(index, { condition: target.value, isNew: false });

    // Эмитим изменения только если зависимость валидна
    const updatedDep = { ...dependency, condition: target.value, isNew: false };
    if (this.isDependencyValid(updatedDep)) {
      this.emitChanges();
    }
  }

  toggleClone(index: number) {
    const dependency = this.dependencies()[index];
    if (dependency) {
      // Обновляем состояние и убираем флаг isNew
      this.updateDependency(index, { clone: !dependency.clone, isNew: false });

      // Эмитим изменения только если зависимость валидна
      const updatedDep = {
        ...dependency,
        clone: !dependency.clone,
        isNew: false,
      };
      if (this.isDependencyValid(updatedDep)) {
        this.emitChanges();
      }
    }
  }

  // Работа с обязательными полями
  addRequiredField() {
    this.requiredToFillFields.update((fields) => [...fields, '']);
  }

  removeRequiredField(index: number) {
    this.requiredToFillFields.update((fields) =>
      fields.filter((_, i) => i !== index),
    );
    this.emitChanges();
  }

  updateRequiredField(index: number, event: Event) {
    const target = event.target as HTMLInputElement;
    this.requiredToFillFields.update((fields) => {
      const newFields = [...fields];
      newFields[index] = target.value;
      return newFields;
    });
    this.emitChanges();
  }

  // Валидация
  isDependencyValid(dependency: FieldDependency): boolean {
    if (!dependency.control.trim()) {
      return false;
    }
    const hasCondition = !!(
      dependency.condition && dependency.condition.trim()
    );
    return hasCondition || !!dependency.clone;
  }

  getDependencyError(dependency: FieldDependency): string | null {
    if (!this.isInitialized() || dependency.isNew) {
      return null; // Не показываем ошибки до инициализации или для новых записей
    }

    if (!dependency.control.trim()) {
      return 'Укажите название поля (control)';
    }
    if (!this.isDependencyValid(dependency)) {
      return 'Укажите либо условие отображения, либо включите клонирование';
    }
    return null;
  }

  getRequiredFieldError(field: string): string | null {
    if (!this.isInitialized()) {
      return null;
    }

    if (!field.trim()) {
      return 'Укажите название поля';
    }
    return null;
  }

  private emitChanges() {
    // Сохраняем все зависимости для внутреннего состояния (в том числе незаполненные)
    const allDependencies = this.dependencies().map(
      ({ control, condition, clone }) => ({
        control: control || '',
        condition: condition || '',
        clone: !!clone,
      }),
    );

    // Для итогового результата фильтруем только корректно заполненные
    const validDependencies = allDependencies.filter(
      (dep) =>
        dep.control.trim() !== '' && (dep.condition.trim() !== '' || dep.clone),
    );

    const allRequiredFields = this.requiredToFillFields();
    const validRequiredFields = allRequiredFields.filter(
      (field) => field.trim() !== '',
    );

    const updates: Partial<FpcInputsInterface> = {};

    // Сохраняем валидные зависимости (очищенные от пустых полей)
    updates.dependent = validDependencies.map(
      ({ control, condition, clone }) => ({
        control,
        ...(condition && condition.trim() && { condition }),
        ...(clone && { clone }),
      }),
    );

    updates.requiredToFill = validRequiredFields;

    // НЕ СОХРАНЯЕМ ВНУТРЕННЕЕ СОСТОЯНИЕ - оставляем как есть для UI
    this.valueChange.emit(updates);
  }

  ngOnDestroy() {
    // Cleanup если потребуется в будущем
  }
}
