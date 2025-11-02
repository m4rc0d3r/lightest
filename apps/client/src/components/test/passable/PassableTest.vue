<template>
  <form class="test" @submit.prevent>
    <span class="title">{{ test.title }}</span>
    <span class="worth">Points: {{ test.maximumScore }}</span>
    <PassableQuestionBlock :questions="test.questions" />
    <button class="submit-for-review-button" @click="submitTestForReview">Submit for review</button>
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { toast } from "vue-sonner";

import PassableQuestionBlock from "./PassableQuestionBlock.vue";

import { Report } from "@/http/dtos/report";
import { QUESTION_TYPE } from "@/models/test/base";
import {
  AnswerOptionToPass,
  QuestionWithAnswerOptionsToPass,
  QuestionWithExtendedAnswerToPass,
  TestToPass,
} from "@/models/test/to-pass";
import { extractData } from "@/services/helpers";
import { TestService } from "@/services/test-service";

export default defineComponent({
  components: {
    PassableQuestionBlock,
  },

  data() {
    return {
      test: new TestToPass(),
    };
  },

  async mounted() {
    await this.loadTest();
  },

  methods: {
    async loadTest() {
      const result = extractData(await TestService.getTestToPass(Number(this.$route.params["id"])));

      if (result instanceof Report) {
        toast.success(result.message);
        if (result.payload) {
          const test = result.payload;
          this.test = new TestToPass(
            test.title,
            test.questions.map((question) => {
              switch (question.type) {
                case QUESTION_TYPE.EXTENDED:
                  return new QuestionWithExtendedAnswerToPass(
                    question.content,
                    question.worth,
                    (question as QuestionWithExtendedAnswerToPass).enteredAnswer,
                    question.id,
                  );
                case QUESTION_TYPE.WITH_ONE_CORRECT_ANSWER_OPTION:
                case QUESTION_TYPE.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS:
                  return new QuestionWithAnswerOptionsToPass(
                    question.type,
                    question.content,
                    question.worth,
                    (question as QuestionWithAnswerOptionsToPass).answerOptions.map(
                      (answerOption) =>
                        new AnswerOptionToPass(
                          answerOption.content,
                          answerOption.isChosen,
                          answerOption.id,
                        ),
                    ),
                    question.id,
                  );
                default:
                  throw new Error(
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    `Wrong question type '${question.type}' detected while uploading a test to pass.`,
                  );
              }
            }),
            test.id,
          );
        }
      } else {
        toast.error(result.message);
      }
    },

    async submitTestForReview() {
      const result = extractData(await TestService.submitTestForReview(this.test));

      if (result instanceof Report) {
        toast.success(result.message);
        if (result.payload) {
          void this.$router.push(`/passed-test/${result.payload}`);
        }
      } else {
        toast.error(result.message);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.test {
  display: flex;
  flex-direction: column;

  margin: 10px;
  padding: 20px;
  border: 4px solid #1e434c;
  border-radius: 5px;

  > * {
    margin-bottom: 20px;
    color: #070f11;
  }

  > *:last-child {
    margin-bottom: 0;
  }

  > .title {
    font-size: 2rem;
    font-weight: bold;
    color: #070f11;
  }

  > .worth {
    font-size: 1.5rem;
    color: #070f11;
  }
}

.submit-for-review-button {
  padding: 5px;
  border: 1px solid black;
  border-radius: 5px;

  color: white;
  text-align: center;
  text-decoration: none;

  background-color: #1e434c;
}
</style>
