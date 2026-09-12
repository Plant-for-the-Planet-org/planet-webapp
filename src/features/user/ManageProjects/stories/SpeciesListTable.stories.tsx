import type { Meta, StoryObj } from '@storybook/react';
import type { QuestionnaireSpeciesRow } from '../../../common/types/project';

import { useState } from 'react';
import SpeciesListTable from '../components/microComponent/SpeciesListTable';
import {
  listSpeciesColumns,
  listSpeciesMinRows,
} from './mockQuestionnaireSchema';

const meta: Meta<typeof SpeciesListTable> = {
  title: 'ManageProjects/SpeciesListTable',
  component: SpeciesListTable,
};
export default meta;
type Story = StoryObj<typeof SpeciesListTable>;

// The app wraps this table in a react-hook-form `Controller`, so whatever it emits comes straight back as `value`. The harness recreates that loop, which the bugs below need in order to appear at all.
function Harness({
  initial = [],
  minRows = listSpeciesMinRows,
}: {
  initial?: QuestionnaireSpeciesRow[];
  minRows?: number;
}) {
  const [value, setValue] = useState<QuestionnaireSpeciesRow[]>(initial);

  return (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
      <div style={{ minWidth: 620 }}>
        <SpeciesListTable
          columns={listSpeciesColumns}
          minRows={minRows}
          value={value}
          onChange={setValue}
        />
        <button
          type="button"
          onClick={() => setValue([])}
          style={{ marginTop: 16 }}
        >
          Simulate switching to a project with no species
        </button>
      </div>
      <pre
        style={{
          background: '#f6f6f6',
          padding: 12,
          fontSize: 12,
          minWidth: 300,
        }}
      >
        value ({value.length}):{'\n'}
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
}

/** Type a name into the third row. Each keystroke lands in a new row, because the effect on `[value]` resets the input under the cursor. */
export const RowsJumpWhileTyping: Story = {
  render: () => <Harness />,
};

/** Press the button. `value` becomes `[]` but the rows stay, so they get saved to the next project. */
export const ListSurvivesProjectSwitch: Story = {
  render: () => (
    <Harness
      initial={[
        { scientificName: 'Acacia senegal', percentage: 40, origin: 'native' },
      ]}
    />
  ),
};

/** Set a percentage or an origin and leave the name blank. The row is still saved. */
export const RowWithoutSpeciesNameIsSaved: Story = {
  render: () => <Harness minRows={3} />,
};

/** Delete the first row. Rows are keyed by position, so the inputs below shift onto the wrong data. */
export const DeletingARowShiftsInputs: Story = {
  render: () => (
    <Harness
      initial={[
        { scientificName: 'Acacia senegal', percentage: 40, origin: 'native' },
        {
          scientificName: 'Faidherbia albida',
          percentage: 35,
          origin: 'native',
        },
        {
          scientificName: 'Balanites aegyptiaca',
          percentage: 25,
          origin: 'naturalized',
        },
      ]}
    />
  ),
};
