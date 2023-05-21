<template>
	<div class="row" style="margin-top: 4rem">
		<div class="d-flex gap-2">
			<input type="text" id="search" class="form-control" @keyup.enter="sendRequest" v-model="search" :disabled="activeSwitch">
			<button class="btn btn-outline-secondary" @click="changeSwitch()">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sliders" viewBox="0 0 16 16">
					<path fill-rule="evenodd" d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3h9.05zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8h2.05zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1h9.05z"/>
				</svg>
			</button>
		</div>

		<div class="mt-4" v-if="activeSwitch">
			<form>
				<div class="row mb-2">
					<div class="col-4 lbl">
						<p>Archetypes</p>
					</div>
					<div class="col-8">
						<select class="form-select" v-model="advance.data.archetype" :disabled="disabledInputNotMonster">
							<template v-for="(archetype, a) in archetypes" :key="a">
								<option :value="archetype">{{ archetype }}</option>
							</template>
						</select>
					</div>
				</div>

				<div class="row mb-2">
					<div class="col-4 lbl">
						<p>Race Card</p>
					</div>
					<div class="col-4">
						<select class="form-select" v-model="racecard">
							<template v-for="(race, i) in races" :key="i">
								<option :value="race.toLowerCase()">{{ race }}</option>
							</template>
						</select>
					</div>
					<div class="col-4">
						<select class="form-select" v-model="advance.data.race" :disabled="!racecard">
							<template v-for="(option, j) in raceOptionsValue" :key="j">
								<option :value="option">{{ option }}</option>
							</template>
						</select>
					</div>
				</div>

				<div class="row mb-2">
					<div class="col-4 lbl">
						<p>Attribute</p>
					</div>
					<div class="col-8">
						<select class="form-select" v-model="advance.data.attribute" :disabled="disabledInputNotMonster">
							<option>Earth</option>
							<option>Water</option>
							<option>Fire</option>
							<option>Wind</option>
							<option>Light</option>
							<option>Dark</option>
							<option>Divine</option>
						</select>
					</div>
				</div>

				<div class="row mb-2">
					<div class="col-4 lbl">
						<p>Type</p>
					</div>
					<div class="col-8">
						<select class="form-select" v-model="advance.data.type" :disabled="disabledInputNotMonster">
							<template v-for="(type, t) in types" :key="t">
								<option :value="type">{{ type }}</option>
							</template>
						</select>
					</div>
				</div>

				<div class="row mb-2">
					<div class="col-4 lbl">
						<p>ATK</p>
					</div>
					<div class="col-4">
						<select class="form-select" v-model="operator.data.signe_atk" :disabled="disabledInputNotMonster">
							<option value="=">=</option>
							<option value="lt"> &lt; </option>
							<option value="lte"> &lt;= </option>
							<option value="gt"> &gt; </option>
							<option value="gte"> &gt;= </option>
						</select>
					</div>
					<div class="col-4">
						<input type="number" class="form-control" min="0" max="5000" v-model="operator.data.atk" :disabled="disabledInputNotMonster" />
					</div>
				</div>

				<div class="row mb-2">
					<div class="col-4 lbl">
						<p>DEF</p>
					</div>
					<div class="col-4">
						<select class="form-select" v-model="operator.data.signe_def" :disabled="disabledInputNotMonster">
							<option value="=">=</option>
							<option value="lt"> &lt; </option>
							<option value="lte"> &lt;= </option>
							<option value="gt"> &gt; </option>
							<option value="gte"> &gt;= </option>
						</select>
					</div>
					<div class="col-4">
						<input type="number" class="form-control" min="0" max="5000" v-model="operator.data.def" :disabled="disabledInputNotMonster" />
					</div>
				</div>

				<div class="row mb-2">
					<div class="col-4 lbl">
						<p>Level/Rank</p>
					</div>
					<div class="col-4">
						<select class="form-select" v-model="operator.data.signe_level" :disabled="disabledInputNotMonster">
							<option value="=">=</option>
							<option value="lt"> &lt; </option>
							<option value="lte"> &lt;= </option>
							<option value="gt"> &gt; </option>
							<option value="gte"> &gt;= </option>
						</select>
					</div>
					<div class="col-4">
						<input type="number" class="form-control" min="0" max="13" v-model="operator.data.level" :disabled="disabledInputNotMonster" />
					</div>
				</div>

				<div class="row mb-2">
					<div class="col-4 lbl">
						<p>Pendulum Scale</p>
					</div>
					<div class="col-4">
						<select class="form-select" v-model="operator.data.signe_scale" :disabled="disabledInputNotMonster">
							<option value="=">=</option>
							<option value="lt"> &lt; </option>
							<option value="lte"> &lt;= </option>
							<option value="gt"> &gt; </option>
							<option value="gte"> &gt;= </option>
						</select>
					</div>
					<div class="col-4">
						<input type="number" class="form-control" min="0" max="13" v-model="operator.data.scale" :disabled="disabledInputNotMonster" />
					</div>
				</div>

				<div class="row mb-2">
					<div class="col-4 lbl">
						<p>Link</p>
					</div>
					<div class="col-4">
						<select class="form-select" v-model="operator.data.signe_link" :disabled="disabledInputNotMonster">
							<option value="=">=</option>
							<option value="lt"> &lt; </option>
							<option value="lte"> &lt;= </option>
							<option value="gt"> &gt; </option>
							<option value="gte"> &gt;= </option>
						</select>
					</div>
					<div class="col-4">
						<input type="number" class="form-control" min="0" max="6" v-model="operator.data.link" :disabled="disabledInputNotMonster" />
					</div>
				</div>

				<!-- <div class="row mb-2">
					<div class="col-4 lbl">
						<p>Link Arrow</p>
					</div>
					<div class="col-8">
						<input type="text" class="form-control">
					</div>
				</div> -->

				<div class="row px-2">
					<button class="btn btn-primary" @click.prevent="advanceSearch({ ...advance.data, ...operatorValue })">
						Find matches
					</button>
				</div>
			</form>
		</div>
	</div>

	<hr>

	<div class="cards" v-if="!loading">
		<div v-for="(card, i) in cards" :key="i">
			<Card :card="card" v-if="card" />
		</div>
	</div>
</template>

<script setup>

import { ref, reactive, watch, computed, onMounted } from "vue";
import useArchetypes from "@/composables/useArchetypes";
import useCards from "@/composables/useCards";
import Card from "@/components/Card.vue";

const search = ref('');
const advance = reactive({ data: {} });
const operator = reactive({ data: {} });
const activeSwitch = ref(false);
const racecard = ref(null);
const { cards, error, loading, getCards } = useCards();
const { archetypes, getArchetypes } = useArchetypes();

const races = ['Monster', 'Spell', 'Trap'];

const raceOptions = {
	monster: [
		'Aqua', 'Beast', 'Beast-Warrior', 'Creator-God', 'Cyberse', 
		'Dinosaur', 'Divine-Beast', 'Dragon', 'Fairy', 'Fiend', 
		'Fish', 'Insect', 'Machine', 'Plant', 'Psychic', 
		'Pyro', 'Reptile', 'Rock', 'Sea Serpent', 'Spellcaster', 
		'Thunder', 'Warrior', 'Winged Beast', 'Wyrm', 'Zombie',
	],
	spell: ['Normal', 'Field', 'Equip', 'Continuous', 'Quick-Play', 'Ritual'],
	trap: ['Normal', 'Continuous', 'Counter'],
};

const types = [
	'Effect Monster',
	'Flip Effect Monster',
	'Flip Tuner Effect Monster',
	'Gemini Monster',
	'Normal Monster',
	'Normal Tuner Monster',
	'Pendulum Effect Monster',
	'Pendulum Effect Ritual Monster',
	'Pendulum Flip Effect Monster',
	'Pendulum Normal Monster',
	'Pendulum Tuner Effect Monster',
	'Ritual Effect Monster',
	'Ritual Monster',
	'Spirit Monster',
	'Toon Monster',
	'Tuner Monster',
	'Union Effect Monster',
	'Fusion Monster',
	'Link Monster',
	'Pendulum Effect Fusion Monster',
	'Synchro Monster',
	'Synchro Pendulum Effect Monster',
	'Synchro Tuner Monster',
	'XYZ Monster',
	'XYZ Pendulum Effect Monster',
];

onMounted(() => getArchetypes())

const disabledInputNotMonster = computed(() => ['spell', 'trap'].includes(racecard.value))

const raceOptionsValue = computed(() => (racecard.value) ? raceOptions[racecard.value] : [])

const operatorValue = computed(() => {
	let obj = operator.data;
	let res = {};

	Object.keys(obj).forEach(key => {
		if (obj[key] === null || obj[key] === '') {
			delete obj[key];
		}
	});

	if (obj.signe_atk && obj.atk) {
		res.atk = (obj.signe_atk === '=') 
			? res.atk = `${obj.atk}` 
			: res.atk = `${obj.signe_atk}${obj.atk}`;
	}

	if (obj.signe_def && obj.def) {
		res.def = (obj.signe_def === '=') 
			? res.def = `${obj.def}` 
			: res.def = `${obj.signe_def}${obj.def}`;
	}

	if (obj.signe_level && obj.level) {
		res.level = (obj.signe_level === '=') 
			? res.level = `${obj.level}` 
			: res.level = `${obj.signe_level}${obj.level}`;
	}

	return res;
});

function sendRequest() {
	getCards({ fname: search.value });
}

function advanceSearch(data) {
	getCards(data);
	changeSwitch();
}

function changeSwitch() {
	activeSwitch.value = !activeSwitch.value

	if (!activeSwitch.value) {
		advance.data = {};
		operator.data = {};
	}
}

</script>

<style scoped lang="scss">
	.lbl {
		margin: auto 0;
	}

  .cards {
    display: grid;
		grid-template-columns: 1fr;
		gap: 0.5rem;
		margin-bottom: 2rem;

		@media screen and (min-width: 768px) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media screen and (min-width: 1024px) {
			grid-template-columns: repeat(3, 1fr);
		}

		@media screen and (min-width: 1440px) {
			grid-template-columns: repeat(4, 1fr);
		}
  }
</style>