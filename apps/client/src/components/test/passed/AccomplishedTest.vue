<template>
  <form class="test" @submit.prevent>
    <span class="title">{{ test.title }}</span>
    <span class="worth"
      >Grade: {{ receivedScore.toFixed(1) }} out of
      {{ test.maximumScore }}</span
    >
    <AccomplishedQuestionBlock :questions="test.questions" />
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import AccomplishedQuestionBlock from "./AccomplishedQuestionBlock.vue";

import { useNotificationStore } from "@/stores/notification";
import { Notification, Status } from "@/models/notification";
import { QuestionType } from "@/models/test/base";
import {
  PassedTest,
  PassedQuestionWithExtendedAnswer,
  PassedQuestionWithAnswerOptions,
  PassedAnswerOption,
} from "@/models/test/passed";
import { Report } from "@/http/dtos/report";
import { extractData } from "@/services/helpers";
import { TestService } from "@/services/test-service";

export default defineComponent({
  components: {
    AccomplishedQuestionBlock,
  },

  data() {
    return {
      test: new PassedTest(),
      notificationStore: useNotificationStore(),
    };
  },

  async mounted() {
    await this.loadTest();
  },

  computed: {
    receivedScore() {
      return this.test.receivedScore;
    },
  },

  methods: {
    async loadTest() {
      const result = extractData(
        await TestService.getPassedTest(Number(this.$route.params["id"]))
      );

      if (result instanceof Report) {
        this.notificationStore.add(
          new Notification(Status.SUCCESS, result.message)
        );
        if (result.payload) {
          const test = result.payload;
          this.test = new PassedTest(
            test.title,
            test.questions.map((question) => {
              switch (question.type) {
                case QuestionType.EXTENDED:
                  return new PassedQuestionWithExtendedAnswer(
                    question.content,
                    question.worth,
                    (
                      question as PassedQuestionWithExtendedAnswer
                    ).correctAnswer,
                    (
                      question as PassedQuestionWithExtendedAnswer
                    ).enteredAnswer,
                    question.id
                  );
                case QuestionType.WITH_ONE_CORRECT_ANSWER_OPTION:
                case QuestionType.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS:
                  return new PassedQuestionWithAnswerOptions(
                    question.type,
                    question.content,
                    question.worth,
                    (
                      question as PassedQuestionWithAnswerOptions
                    ).answerOptions.map(
                      (answerOption) =>
                        new PassedAnswerOption(
                          answerOption.content,
                          answerOption.isCorrect,
                          answerOption.isChosen,
                          answerOption.id
                        )
                    ),
                    question.id
                  );
                default:
                  throw new Error(
                    `Wrong question type '${question.type}' detected while uploading the passed test.`
                  );
              }
            }),
            test.id
          );
        }
      } else {
        this.notificationStore.add(
          new Notification(Status.FAILURE, result.message)
        );
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.test {
  border: 4px solid #1e434c;
  border-radius: 5px;
  margin: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;

  > * {
    color: #070f11;
    margin-bottom: 20px;
  }

  > *:last-child {
    margin-bottom: 0;
  }

  > .title {
    color: #070f11;
    font-size: 2rem;
    font-weight: bold;
  }

  > .worth {
    color: #070f11;
    font-size: 1.5rem;
  }
}
</style>
