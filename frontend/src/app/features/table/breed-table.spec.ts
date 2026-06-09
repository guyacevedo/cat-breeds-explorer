import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { BreedTable } from './breed-table';
import { BreedService } from '../../core/services/breed.service';
import { Breed } from '../../core/models/breed.model';

const BREEDS = [
  { id: 'abys', name: 'Abyssinian', origin: 'Egypt', temperament: 'Active', life_span: '14 - 15', weight: { metric: '3 - 5', imperial: '7 - 10' } },
  { id: 'beng', name: 'Bengal', origin: 'United States', temperament: 'Alert', life_span: '12 - 15', weight: { metric: '4 - 6', imperial: '8 - 12' } },
] as Breed[];

describe('BreedTable', () => {
  function createComponent() {
    TestBed.configureTestingModule({
      providers: [{ provide: BreedService, useValue: { getAll: () => of(BREEDS) } }],
    });
    return TestBed.runInInjectionContext(() => new BreedTable());
  }

  it('maps all breeds into rows on load', () => {
    // Arrange & Act
    const component = createComponent();

    // Assert
    expect(component['filteredRows']().length).toBe(2);
    expect(component['filteredRows']()[0].weight).toBe('3 - 5 kg');
  });

  it('filters rows by the submitted search text', () => {
    // Arrange
    const component = createComponent();

    // Act
    component['searchText'] = 'bengal';
    component.applySearch();

    // Assert
    const rows = component['filteredRows']();
    expect(rows.length).toBe(1);
    expect(rows[0].name).toBe('Bengal');
  });

  it('matches on origin too', () => {
    // Arrange
    const component = createComponent();

    // Act
    component['searchText'] = 'egypt';
    component.applySearch();

    // Assert
    expect(component['filteredRows']()[0].id).toBe('abys');
  });
});
