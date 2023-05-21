<template>
  <div v-if="loading">
    <p>loading</p>
  </div>
	<div class="container cardDetail" v-if="!loading && card">
    <div class="cardDetail__pic">
      <img :src="card.image" :alt="card.name">
    </div>
    <div class="cardDetail__body">
      <div class="cardDetail__information">
        <h6 class="cardDetail__heading">Information</h6>
        <table class="table table-sm">
          <template v-if="!['spell', 'trap'].includes(card.frameType)">
            <tr>
              <td>Attribute</td>
              <td>{{ card.attribute }}</td>
            </tr>
            <tr>
              <td>Types</td>
              <td>{{ card.type }}</td>
            </tr>
            <tr v-if="card.level">
              <td>Level</td>
              <td>{{ card.level }}</td>
            </tr>
            <tr v-if="card.linkval">
              <td>Linkval</td>
              <td>{{ card.linkval }}</td>
            </tr>
            <tr>
              <td>Atk</td>
              <td>{{ card.atk }}</td>
            </tr>
            <tr v-if="card.def">
              <td>Def</td>
              <td>{{ card.def }}</td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td>Property</td>
              <td>{{ card.race }}</td>
            </tr>
          </template>
        </table>
      </div>
      <div class="cardDetail__lorem">
        <h6 class="cardDetail__heading">Card Info</h6>
        <p class="cardDetail__html" v-html="card.desc"></p>
      </div>
    </div>
	</div>
</template>

<script setup>
  import { onMounted } from 'vue';
  import useCardDetail from "@/composables/useCardDetail"
  const { id } = defineProps(['id']);
  const { card, error, loading, getCardDetail } = useCardDetail()

  onMounted(() => {
    getCardDetail({ id });
  })
</script>

<style scoped lang="scss">
  .table-sm > :not(caption) > * > * {
    padding: 1px 0;
  }
  .cardDetail {
    display: flex;
    flex-direction: column;

    &__pic {
      margin: 0 auto;
      padding: 1rem;
    }

    &__body {
      margin-bottom: 1rem;
    }

    &__heading {
      background-color: #2dae26;
      color: #fff;
      text-align: center;
      padding: 4px 0 !important;
    }

    &__html {
      white-space: pre-line;
      text-align: justify;
      padding: 0.25rem !important;
      font-size: 0.875rem;
    }
  }
</style>