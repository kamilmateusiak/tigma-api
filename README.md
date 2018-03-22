# Vicunia - graphql

## Development
Aby odpalić lokalnie apkę trzeba:
- dodać plik .env w katalogu głównym i zdefiniować env DB_URL
```
DB_URL = mysql://user:password@host:3306/baza
```
- zainstalować paczki z npm
```
yarn  /  npm install
```
Aplikację startujemy odpając komendę
```
npm start   /   yarn start
```
## Testing
Testować nasz endpoint możemy wchodząc w przeglądarce na adres: localhost:3000/endpoint. W przypadku przygotowanego endpointa do wyciągania danych usera będzie to:
```
localhost:3000/graphql
```
Po wejściu mozemy wykonać zapytanie o dane usera podając jego id, na przykład:
```
{
  user(id: 54) {
    ID,
    display_name
  }
}
```
Dodatkowo warto zainstalować apollo-client-dev-tools do przeglądarki Chrome : https://github.com/apollographql/apollo-client-devtools

## Tasks
1. W pierwszej fazie mamy do zrobienia zapytania do 3 widoków:
![Widoki](graphql.jpg?raw=true "Kminy")
W tej fazie ograniczamy się do backendu i wyciągnięcia potrzebnych danych. Ćwiczymy przede wszystkim architekturę apki opartej na qraphqlu (przestawiamy myślenie RESTowe) i piszemy nasze Query o potrzebne do widoków rzeczy. Dodatkowo można ogarnąć na przykład mutacje i na przykład wystartować na wybranym userze trackowanie.

## Api
1. Timetracks
{
  projectPhasesWithTimetracks(state: "active") {
    project_phase_id
    project_id
    phase_name
    phase_state
    phase_start
    closed_by
    closed_date,
    closed_by_user {
      display_name
    },
    timetracks {
    	description
      start
      stop
      user {
        display_name
      }
		}
    project {
      project_name
    }
  }
}

2. User
{
  user(id: 54) {
    display_name
  }
}

3. Users
{
	users {
    display_name
  }
}
