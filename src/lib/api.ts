import { Option } from "@/components/form/AutoComplete";

export async function fetchBookTitles(): Promise<Option[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    { value: "1", label: "해리포터와 마법사의 돌" },
    { value: "2", label: "해리포터와 비밀의 방" },
    { value: "3", label: "해리포터와 아즈카반의 죄수" },
    { value: "4", label: "해리포터와 불의 잔" },
    { value: "5", label: "해리포터와 불사조 기사단" },
    { value: "6", label: "해리포터와 혼혈 왕자" },
    { value: "7", label: "해리포터와 죽음의 성물" },
    { value: "8", label: "반지의 제왕: 반지 원정대" },
    { value: "9", label: "반지의 제왕: 두 개의 탑" },
    { value: "10", label: "반지의 제왕: 왕의 귀환" },
  ];
}

export async function fetchAuthors(): Promise<Option[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  return [
    { value: "1", label: "J.K. 롤링" },
    { value: "2", label: "J.R.R. 톨킨" },
    { value: "3", label: "조지 R.R. 마틴" },
    { value: "4", label: "스티븐 킹" },
    { value: "5", label: "무라카미 하루키" },
    { value: "6", label: "김영하" },
    { value: "7", label: "한강" },
    { value: "8", label: "이상" },
  ];
}

