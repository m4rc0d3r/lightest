<template>
  <form class="test" @submit.prevent>
    <div class="title">
      <label for="">Title</label>
      <input type="text" v-model="test.title" />
    </div>
    <!-- <input class="title" type="text" placeholder="Title" v-model="test.title" /> -->
    <EditableQuestionBlock
      :questions="test.questions"
      @add-question="test.addQuestion.call(test)"
      @change-question-type="
        (questionIndex, type) => test.changeQuestionType.call(test, questionIndex, type)
      "
      @delete-question="(questionIndex) => test.deleteQuestion.call(test, questionIndex)"
    />
    <button v-if="mode === creationMode" @click="create">Create</button>
    <button v-else @click="update">Save</button>
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import EditableQuestionBlock from "./EditableQuestionBlock.vue";

import { APIError, API_ERROR_CODE } from "@/http/dtos/api-error";
import { Report } from "@/http/dtos/report";
import { Notification, STATUS } from "@/models/notification";
import { QUESTION_TYPE } from "@/models/test/base";
import {
  AnswerOptionToEdit,
  QuestionWithAnswerOptionsToEdit,
  QuestionWithExtendedAnswerToEdit,
  TestToEdit,
} from "@/models/test/to-edit";
import { extractData } from "@/services/helpers";
import { TestService } from "@/services/test-service";
import { useNotificationStore } from "@/stores/notification";

const MODE = {
  CREATION: "CREATION",
  EDITING: "EDITING",
} as const;
type Mode = (typeof MODE)[keyof typeof MODE];

export default defineComponent({
  components: {
    EditableQuestionBlock,
  },

  data() {
    return {
      test: new TestToEdit(),
      notificationStore: useNotificationStore(),
      mode: MODE.CREATION as Mode,
    };
  },

  created() {
    if (this.$route.path !== "/create-test") {
      this.mode = MODE.EDITING;
    }
  },

  async mounted() {
    if (this.mode === MODE.EDITING) {
      await this.loadTest();
    }
  },

  computed: {
    creationMode() {
      return MODE.CREATION;
    },

    editingMode() {
      return MODE.EDITING;
    },
  },

  methods: {
    async create() {
      const start = Date.now();
      const result = extractData(await TestService.create(this.test));
      const end = Date.now();
      console.log(`Test creation took ${end - start} ms.`);

      if (result instanceof Report) {
        this.notificationStore.add(new Notification(STATUS.SUCCESS, result.message));
      } else if (result instanceof APIError) {
        this.notificationStore.add(new Notification(STATUS.FAILURE, result.message));
        if (result.code !== API_ERROR_CODE.ERR_NETWORK) {
          void this.$router.push("/");
        }
      }
    },

    async loadTest() {
      const result = extractData(await TestService.getTestToEdit(Number(this.$route.params["id"])));

      if (result instanceof Report) {
        this.notificationStore.add(new Notification(STATUS.SUCCESS, result.message));
        if (result.payload) {
          const test = result.payload;
          this.test = new TestToEdit(
            test.title,
            test.questions.map((question) => {
              switch (question.type) {
                case QUESTION_TYPE.EXTENDED:
                  return new QuestionWithExtendedAnswerToEdit(
                    question.content,
                    question.worth,
                    (question as QuestionWithExtendedAnswerToEdit).correctAnswer,
                    question.id,
                  );
                case QUESTION_TYPE.WITH_ONE_CORRECT_ANSWER_OPTION:
                case QUESTION_TYPE.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS:
                  return new QuestionWithAnswerOptionsToEdit(
                    question.type,
                    question.content,
                    question.worth,
                    (question as QuestionWithAnswerOptionsToEdit).answerOptions.map(
                      (answerOption) =>
                        new AnswerOptionToEdit(
                          answerOption.content,
                          answerOption.isCorrect,
                          answerOption.id,
                        ),
                    ),
                    question.id,
                  );
                default:
                  throw new Error(
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    `Wrong question type '${question.type}' detected while uploading a test to edit.`,
                  );
              }
            }),
            test.id,
          );
        }
      } else {
        this.notificationStore.add(new Notification(STATUS.FAILURE, result.message));
      }
    },

    async update() {
      const start = Date.now();
      const result = extractData(await TestService.update(this.test));
      const end = Date.now();
      console.log(`Saving the edited test took ${end - start} ms.`);

      if (result instanceof Report) {
        if (result.payload) {
          const test = result.payload;
          this.test = new TestToEdit(
            test.title,
            test.questions.map((question) => {
              switch (question.type) {
                case QUESTION_TYPE.EXTENDED:
                  return new QuestionWithExtendedAnswerToEdit(
                    question.content,
                    question.worth,
                    (question as QuestionWithExtendedAnswerToEdit).correctAnswer,
                    question.id,
                  );
                case QUESTION_TYPE.WITH_ONE_CORRECT_ANSWER_OPTION:
                case QUESTION_TYPE.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS:
                  return new QuestionWithAnswerOptionsToEdit(
                    question.type,
                    question.content,
                    question.worth,
                    (question as QuestionWithAnswerOptionsToEdit).answerOptions.map(
                      (answerOption) =>
                        new AnswerOptionToEdit(
                          answerOption.content,
                          answerOption.isCorrect,
                          answerOption.id,
                        ),
                    ),
                    question.id,
                  );
                default:
                  throw new Error(
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    `Wrong question type '${question.type}' detected while uploading a test to edit.`,
                  );
              }
            }),
            test.id,
          );
        }

        this.notificationStore.add(new Notification(STATUS.SUCCESS, result.message));
      } else if (result instanceof APIError) {
        this.notificationStore.add(new Notification(STATUS.FAILURE, result.message));
        if (result.code !== API_ERROR_CODE.ERR_NETWORK) {
          void this.$router.push("/");
        }
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
  }

  > *:last-child {
    margin-bottom: 0;
  }

  > .title {
    display: flex;
    flex-direction: column;

    > label {
      font-size: 1.5rem;
      color: #070f11;
    }

    > input {
      font-size: 1.5rem;
    }
  }
}
</style>
