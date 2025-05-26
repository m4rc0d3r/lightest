<template>
  <form class="test" @submit.prevent>
    <span class="title">{{ test.title }}</span>
    <span class="worth">Grade: {{ test.maximumScore }}</span>
    <PassableQuestionBlock :questions="test.questions" />
    <button class="submit-for-review-button" @click="submitTestForReview">
      Submit for review
    </button>
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import PassableQuestionBlock from "./PassableQuestionBlock.vue";

import { useNotificationStore } from "@/stores/notification";
import { Notification, Status } from "@/models/notification";
import { QuestionType } from "@/models/test/base";
import {
  TestToPass,
  QuestionWithExtendedAnswerToPass,
  QuestionWithAnswerOptionsToPass,
  AnswerOptionToPass,
} from "@/models/test/to-pass";
import { Report } from "@/http/dtos/report";
import { extractData } from "@/services/helpers";
import { TestService } from "@/services/test-service";

export default defineComponent({
  components: {
    PassableQuestionBlock,
  },

  data() {
    return {
      test: new TestToPass(),
      notificationStore: useNotificationStore(),
    };
  },

  async mounted() {
    await this.loadTest();
  },

  methods: {
    async loadTest() {
      const result = extractData(
        await TestService.getTestToPass(Number(this.$route.params["id"]))
      );

      if (result instanceof Report) {
        this.notificationStore.add(
          new Notification(Status.SUCCESS, result.message)
        );
        if (result.payload) {
          const test = result.payload;
          this.test = new TestToPass(
            test.title,
            test.questions.map((question) => {
              switch (question.type) {
                case QuestionType.EXTENDED:
                  return new QuestionWithExtendedAnswerToPass(
                    question.content,
                    question.worth,
                    (
                      question as QuestionWithExtendedAnswerToPass
                    ).enteredAnswer,
                    question.id
                  );
                case QuestionType.WITH_ONE_CORRECT_ANSWER_OPTION:
                case QuestionType.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS:
                  return new QuestionWithAnswerOptionsToPass(
                    question.type,
                    question.content,
                    question.worth,
                    (
                      question as QuestionWithAnswerOptionsToPass
                    ).answerOptions.map(
                      (answerOption) =>
                        new AnswerOptionToPass(
                          answerOption.content,
                          answerOption.isChosen,
                          answerOption.id
                        )
                    ),
                    question.id
                  );
                default:
                  throw new Error(
                    `Wrong question type '${question.type}' detected while uploading a test to pass.`
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

    async submitTestForReview() {
      const result = extractData(
        await TestService.submitTestForReview(this.test)
      );

      if (result instanceof Report) {
        this.notificationStore.add(
          new Notification(Status.SUCCESS, result.message)
        );
        if (result.payload) {
          this.$router.push(`/passed-test/${result.payload}`);
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

.submit-for-review-button {
  background-color: #1e434c;
  border: 1px solid black;
  border-radius: 5px;
  padding: 5px;
  color: white;
  text-decoration: none;
  text-align: center;
}
</style>
