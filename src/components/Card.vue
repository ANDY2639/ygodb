<template>
	<div class="cardinfo">
    <div class="cardinfo__body">
      <h4 class="cardinfo__title">{{ card.name }}</h4>
      <p class="cardinfo__level" v-if="card.level">Level {{ card.level }}</p>
      <template v-if="!['spell', 'trap'].includes(card.frameType)">
        <p class="cardinfo__type">{{ card.attribute }} / {{ card.race }}</p>
      </template>
      <template v-else>
        <p class="cardinfo__type">{{ card.type }} / {{ card.race }}</p>
      </template>
      <p class="cardinfo__atkdef" v-if="card.atk">{{ card.atk }}/{{ card.def }}</p>
    </div>
    <div class="cardinfo__image">
      <img :src="card.image" width="150" :alt="card.name" />
    </div>
    <router-link :to="{ name: 'Detail', params: { id: card.id } }" class="stretched-link"></router-link>
	</div>
</template>

<script setup>
const { card } = defineProps(['card'])
</script>

<style scoped lang="scss">
  .stretched-link::after {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    content: "";
    pointer-events: auto;
    background-color: rgba(0,0,0,0);
	}

  .cardinfo {
    position: relative;
    display: flex;
    justify-content: space-between;
    gap: 1.5rem;
    color: #fff;
    background-color: #6b6b6b;
    padding: 1rem 0;
    padding-left: 1rem;

    &__body {
      width: 70%;
    }

    &__title {
      font-size: 1rem;
    }

    &__imagen {
      width: 30%;
      margin: 0 auto;
    }
  }
</style>